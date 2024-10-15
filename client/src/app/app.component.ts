import { Component } from '@angular/core';
import { LogActivityComponent } from './log-activity/log-activity.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ActivityCalendarComponent } from './activity-calendar/activity-calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [LogActivityComponent, ActivityListComponent, ActivityCalendarComponent], // Import standalone components
})
export class AppComponent {}
