import { ChangeDetectionStrategy, Component, viewChild, type ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'kc-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly links = [
    { path: '/', label: 'Home', exact: true },
    { path: '/spaces', label: 'Spaces', exact: false },
    { path: '/equipment', label: 'Equipment', exact: false },
    { path: '/courses', label: 'Courses', exact: false },
  ];

  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  /** A plain #main link would resolve against <base href="/"> and navigate away from the route. */
  protected skipToMain(event: Event): void {
    event.preventDefault();
    this.main().nativeElement.focus();
  }
}
