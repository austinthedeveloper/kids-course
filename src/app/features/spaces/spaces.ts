import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'kc-spaces',
  template: `
    <h1>Spaces</h1>
    <p>Drawing and saving rooms is not built yet.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spaces {}
