import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'kc-courses',
  template: `
    <h1>Courses</h1>
    <p>Generating and saving courses is not built yet.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Courses {}
