import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'kc-not-found',
  imports: [RouterLink],
  template: `
    <h1>Page not found</h1>
    <p>That page does not exist. <a routerLink="/">Go to Home</a>.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
