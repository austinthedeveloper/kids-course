import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'kc-equipment',
  template: `
    <h1>Equipment</h1>
    <p>Listing the gear you own is not built yet.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Equipment {}
