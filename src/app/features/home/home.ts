import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'kc-home',
  template: `
    <h1>Plan movement courses that fit your real room</h1>
    <p>
      Draw the room you have, list the gear you own, and get a station-by-station course that passes
      the app's layout checks. You stay in charge: inspect the setup and supervise play.
    </p>
    <p>This is an early build. Nothing can be saved or generated yet.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
