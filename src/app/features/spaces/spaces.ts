import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  type ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import Konva from 'konva';
import { type Point, type Polygon, type Room, formatArea, formatLength } from '../../core/domain';
import {
  roomConcaveNotch,
  roomHallwayBlocked,
  roomLNarrowCouch,
  roomNestedObstacles,
  roomRectangleOpen,
  roomTouchingEdge,
} from '../../core/fixtures';
import {
  DEFAULT_GRID_CM,
  type ViewTransform,
  IDENTITY_VIEW,
  boundingBox,
  fitToView,
  moveVertex,
  panBy,
  polygonArea,
  rectangleCorners,
  rotationTowards,
  screenToWorld,
  zoomAt,
} from '../../core/geometry';

const HANDLE_RADIUS_PX = 22;
const ROTATE_HANDLE_GAP_PX = 44;
const ROTATE_STEP_DEG = 15;
const MAT = { widthCm: 120, depthCm: 60 };

const OBSTACLE_FILL: Record<Room['obstacles'][number]['type'], string> = {
  furniture: '#8a8f99',
  hazard: '#c0392b',
  'keep-clear': '#d9a400',
};

const flatten = (points: readonly Point[]) => points.flatMap((point) => [point.x, point.y]);

/**
 * SP-001 canvas spike. Prototype code: it answers whether Konva suits this editor and may be
 * replaced by EN-013. Geometry lives in world centimetres in signals and the pure core modules;
 * Konva only draws it and reports pointers.
 */
@Component({
  selector: 'kc-spaces',
  templateUrl: './spaces.html',
  styleUrl: './spaces.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spaces {
  protected readonly rooms: readonly Room[] = [
    roomLNarrowCouch,
    roomRectangleOpen,
    roomHallwayBlocked,
    roomConcaveNotch,
    roomTouchingEdge,
    roomNestedObstacles,
  ];

  protected readonly roomId = signal(roomLNarrowCouch.id);
  protected readonly room = computed(
    () => this.rooms.find((room) => room.id === this.roomId()) ?? roomLNarrowCouch,
  );
  protected readonly boundary = signal<Polygon>(roomLNarrowCouch.boundary!);
  protected readonly snap = signal(true);
  protected readonly matRotation = signal(0);
  protected readonly view = signal<ViewTransform>(IDENTITY_VIEW);
  protected readonly message = signal('');
  protected readonly floorArea = computed(() =>
    formatArea(polygonArea(this.boundary().vertices), 'imperial'),
  );

  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');
  private readonly destroyRef = inject(DestroyRef);

  private stage?: Konva.Stage;
  private floorLine?: Konva.Line;
  private boundaryLine?: Konva.Line;
  private matLine?: Konva.Line;
  private rotateHandle?: Konva.Circle;
  private grid?: Konva.Shape;
  private obstacleLayer?: Konva.Layer;
  private handleLayer?: Konva.Layer;
  private cornerHandles: Konva.Circle[] = [];

  private matCenter: Point = { x: 0, y: 0 };
  private userMovedView = false;
  private panFrom: { x: number; y: number } | null = null;
  private pinch: { distance: number } | null = null;
  private activeDrag: { node: Konva.Node; before: Polygon } | null = null;

  constructor() {
    afterNextRender(() => this.createStage());
  }

  protected formatCm(cm: number): string {
    return formatLength(cm, 'metric');
  }

  protected selectRoom(id: string): void {
    const room = this.rooms.find((candidate) => candidate.id === id);
    if (!room?.boundary) return;
    this.roomId.set(room.id);
    this.boundary.set(room.boundary);
    this.message.set('');
    this.placeMat();
    this.rebuildRoomNodes();
    this.fit();
  }

  protected zoomBy(factor: number): void {
    const stage = this.stage;
    if (!stage) return;
    this.userMovedView = true;
    this.setView(zoomAt(this.view(), { x: stage.width() / 2, y: stage.height() / 2 }, factor));
  }

  protected fit(): void {
    const stage = this.stage;
    if (!stage) return;
    this.userMovedView = false;
    const box = boundingBox(this.boundary().vertices);
    this.setView(fitToView(box, { width: stage.width(), height: stage.height() }));
  }

  private createStage(): void {
    const container = this.host().nativeElement;
    // Keeps events flowing to the stage while a handle is dragged, so a second finger is noticed.
    Konva.hitOnDragEnabled = true;

    const stage = new Konva.Stage({
      container,
      width: container.clientWidth,
      height: container.clientHeight,
    });
    this.stage = stage;

    const backdrop = new Konva.Layer({ listening: false });
    this.grid = new Konva.Shape({
      stroke: '#e3e5ea',
      strokeWidth: 1,
      strokeScaleEnabled: false,
      sceneFunc: (context, shape) => this.drawGrid(context, shape),
    });
    this.floorLine = new Konva.Line({ closed: true, fill: '#f3f6fb' });
    // Clipped to the room, so the area outside an L-shape does not read as usable floor.
    const clippedGrid = new Konva.Group({
      clipFunc: (context) => {
        const vertices = this.boundary().vertices;
        context.beginPath();
        vertices.forEach((vertex, index) => {
          if (index === 0) context.moveTo(vertex.x, vertex.y);
          else context.lineTo(vertex.x, vertex.y);
        });
        context.closePath();
      },
    });
    clippedGrid.add(this.grid);
    // Walls go on top of the grid so they stay solid.
    this.boundaryLine = new Konva.Line({
      closed: true,
      stroke: '#1d2433',
      strokeWidth: 3,
      strokeScaleEnabled: false,
    });
    backdrop.add(this.floorLine, clippedGrid, this.boundaryLine);

    this.obstacleLayer = new Konva.Layer({ listening: false });

    const matLayer = new Konva.Layer({ listening: false });
    this.matLine = new Konva.Line({
      closed: true,
      fill: 'rgba(31, 95, 191, 0.25)',
      stroke: '#1f5fbf',
      strokeWidth: 2,
      strokeScaleEnabled: false,
    });
    matLayer.add(this.matLine);

    this.handleLayer = new Konva.Layer();
    stage.add(backdrop, this.obstacleLayer, matLayer, this.handleLayer);

    this.placeMat();
    this.rebuildRoomNodes();
    this.bindViewGestures(stage);
    this.fit();

    const observer = new ResizeObserver(() => {
      stage.size({ width: container.clientWidth, height: container.clientHeight });
      if (this.userMovedView) this.render();
      else this.fit();
    });
    observer.observe(container);

    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      stage.destroy();
    });
  }

  /** Puts the sample mat at the middle of the room's bounding box. It is only a rotation demo. */
  private placeMat(): void {
    const box = boundingBox(this.boundary().vertices);
    this.matCenter = {
      x: box.minX + Math.min(MAT.widthCm, box.maxX - box.minX) * 0.75,
      y: box.minY + Math.min(MAT.depthCm * 2, box.maxY - box.minY) * 0.75,
    };
    this.matRotation.set(0);
  }

  private rebuildRoomNodes(): void {
    const obstacles = this.obstacleLayer;
    const handles = this.handleLayer;
    if (!obstacles || !handles) return;

    obstacles.destroyChildren();
    for (const obstacle of this.room().obstacles) {
      obstacles.add(
        new Konva.Line({
          closed: true,
          points: flatten(obstacle.shape.vertices),
          fill: OBSTACLE_FILL[obstacle.type],
          opacity: 0.7,
          stroke: '#1d2433',
          strokeWidth: 1,
          strokeScaleEnabled: false,
        }),
      );
    }

    handles.destroyChildren();
    this.cornerHandles = this.boundary().vertices.map((_vertex, index) => {
      const handle = this.createHandle('#ffffff', '#1d2433');
      handle.on('dragstart', () => this.beginDrag(handle));
      handle.on('dragmove', () => this.dragCorner(handle, index));
      handle.on('dragend', () => this.endDrag());
      handles.add(handle);
      return handle;
    });

    this.rotateHandle = this.createHandle('#1f5fbf', '#ffffff');
    this.rotateHandle.on('dragstart', () => this.beginDrag(this.rotateHandle!));
    this.rotateHandle.on('dragmove', () => this.dragRotation());
    this.rotateHandle.on('dragend', () => this.endDrag());
    handles.add(this.rotateHandle);

    this.render();
  }

  private createHandle(fill: string, stroke: string): Konva.Circle {
    // The visible dot is smaller than the 44 px hit area, which stays comfortable for fingers.
    return new Konva.Circle({
      draggable: true,
      fill,
      stroke,
      strokeWidth: 2,
      strokeScaleEnabled: false,
      hitFunc: (context, shape) => {
        context.beginPath();
        context.arc(0, 0, HANDLE_RADIUS_PX / this.view().scale, 0, Math.PI * 2);
        context.closePath();
        context.fillStrokeShape(shape);
      },
    });
  }

  private beginDrag(node: Konva.Node): void {
    this.activeDrag = { node, before: this.boundary() };
    this.message.set('');
  }

  private endDrag(): void {
    this.activeDrag = null;
    this.render();
  }

  private pointerWorld(): Point | null {
    const pointer = this.stage?.getPointerPosition();
    return pointer ? screenToWorld(this.view(), pointer) : null;
  }

  private dragCorner(handle: Konva.Circle, index: number): void {
    const world = this.pointerWorld();
    if (world) {
      const grid = this.snap() ? DEFAULT_GRID_CM : null;
      const result = moveVertex(this.boundary(), index, world, grid);
      if (result.ok) {
        this.boundary.set(result.value);
        this.message.set('');
      } else {
        const reason = result.error[0]?.message ?? 'That shape is not valid.';
        this.message.set(`${reason} Kept the last valid shape.`);
      }
    }
    // Pull the handle back onto the committed geometry, whatever the pointer did.
    handle.position(this.boundary().vertices[index]!);
    this.render();
  }

  private dragRotation(): void {
    const world = this.pointerWorld();
    if (world) {
      const step = this.snap() ? ROTATE_STEP_DEG : null;
      this.matRotation.set(Math.round(rotationTowards(this.matCenter, world, step) * 10) / 10);
    }
    this.render();
  }

  private bindViewGestures(stage: Konva.Stage): void {
    stage.on('wheel', (event) => {
      event.evt.preventDefault();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      this.userMovedView = true;
      this.setView(zoomAt(this.view(), pointer, event.evt.deltaY < 0 ? 1.1 : 1 / 1.1));
    });

    stage.on('mousedown touchstart', (event) => {
      const touches = 'touches' in event.evt ? event.evt.touches : null;
      if (touches && touches.length === 2) {
        this.cancelActiveDrag();
        this.panFrom = null;
        this.pinch = { distance: touchDistance(touches) };
        return;
      }
      if (event.target === stage) {
        const pointer = stage.getPointerPosition();
        this.panFrom = pointer ? { x: pointer.x, y: pointer.y } : null;
      }
    });

    stage.on('mousemove touchmove', (event) => {
      const touches = 'touches' in event.evt ? event.evt.touches : null;
      if (touches && touches.length === 2 && this.pinch) {
        event.evt.preventDefault();
        const distance = touchDistance(touches);
        const rect = this.host().nativeElement.getBoundingClientRect();
        const anchor = {
          x: (touches[0]!.clientX + touches[1]!.clientX) / 2 - rect.left,
          y: (touches[0]!.clientY + touches[1]!.clientY) / 2 - rect.top,
        };
        this.userMovedView = true;
        this.setView(zoomAt(this.view(), anchor, distance / this.pinch.distance));
        this.pinch = { distance };
        return;
      }
      if (this.panFrom) {
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        this.userMovedView = true;
        this.setView(panBy(this.view(), pointer.x - this.panFrom.x, pointer.y - this.panFrom.y));
        this.panFrom = { x: pointer.x, y: pointer.y };
      }
    });

    stage.on('mouseup touchend', () => {
      this.panFrom = null;
      this.pinch = null;
    });
  }

  /** A second finger means pinch, not edit: undo the drag so pinching never moves a shape. */
  private cancelActiveDrag(): void {
    const drag = this.activeDrag;
    if (!drag) return;
    drag.node.stopDrag();
    this.boundary.set(drag.before);
    this.activeDrag = null;
    this.message.set('');
    this.render();
  }

  private setView(view: ViewTransform): void {
    this.view.set(view);
    this.render();
  }

  private render(): void {
    const stage = this.stage;
    if (!stage) return;
    const view = this.view();
    stage.scale({ x: view.scale, y: view.scale });
    stage.position({ x: view.offsetX, y: view.offsetY });

    const outline = flatten(this.boundary().vertices);
    this.floorLine?.points(outline);
    this.boundaryLine?.points(outline);

    const radius = HANDLE_RADIUS_PX / 2 / view.scale;
    this.boundary().vertices.forEach((vertex, index) => {
      const handle = this.cornerHandles[index];
      if (!handle) return;
      handle.radius(radius);
      if (this.activeDrag?.node !== handle) handle.position(vertex);
    });

    const rotation = this.matRotation();
    this.matLine?.points(
      flatten(rectangleCorners(MAT.widthCm, MAT.depthCm, this.matCenter, rotation)),
    );
    if (this.rotateHandle) {
      const reach = MAT.depthCm / 2 + ROTATE_HANDLE_GAP_PX / view.scale;
      const radians = (rotation * Math.PI) / 180;
      this.rotateHandle.radius(radius);
      this.rotateHandle.position({
        x: this.matCenter.x + reach * Math.sin(radians),
        y: this.matCenter.y - reach * Math.cos(radians),
      });
    }
    stage.batchDraw();
  }

  private drawGrid(context: Konva.Context, shape: Konva.Shape): void {
    const { minX, minY, maxX, maxY } = boundingBox(this.boundary().vertices);
    context.beginPath();
    for (let x = minX; x <= maxX; x += DEFAULT_GRID_CM) {
      context.moveTo(x, minY);
      context.lineTo(x, maxY);
    }
    for (let y = minY; y <= maxY; y += DEFAULT_GRID_CM) {
      context.moveTo(minX, y);
      context.lineTo(maxX, y);
    }
    context.strokeShape(shape);
  }
}

function touchDistance(touches: TouchList): number {
  const a = touches[0]!;
  const b = touches[1]!;
  return Math.max(Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), 1);
}
