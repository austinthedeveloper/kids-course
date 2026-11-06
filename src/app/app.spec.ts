import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App shell', () => {
  async function render() {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    return fixture;
  }

  it('renders landmarks and main navigation', async () => {
    const element = (await render()).nativeElement as HTMLElement;
    expect(element.querySelector('header')).not.toBeNull();
    expect(element.querySelector('nav[aria-label="Main"]')).not.toBeNull();
    expect(element.querySelector('main')).not.toBeNull();
    expect(element.querySelector('footer')).not.toBeNull();
    const labels = [...element.querySelectorAll('nav a')].map((a) => a.textContent?.trim());
    expect(labels).toEqual(['Home', 'Spaces', 'Equipment', 'Courses']);
  });

  it('shows the adult-supervision notice on every page', async () => {
    const element = (await render()).nativeElement as HTMLElement;
    expect(element.querySelector('footer')?.textContent).toContain('not a safety certification');
  });

  it('skip link moves focus to main without navigating', async () => {
    const fixture = await render();
    const element = fixture.nativeElement as HTMLElement;
    document.body.appendChild(element);
    const event = new MouseEvent('click', { cancelable: true, bubbles: true });
    element.querySelector('.skip-link')?.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(element.querySelector('main'));
    element.remove();
  });
});
