import { Routes } from '@angular/router';
import { ActivityCalendarComponent } from './activity-calendar/activity-calendar.component';
import { LogActivityComponent } from './log-activity/log-activity.component';
import { ActivityListComponent } from './activity-list/activity-list.component';

export const routes: Routes = [
    { path: '', component: ActivityCalendarComponent },
  { path: 'log', component: LogActivityComponent },
  { path: 'list', component: ActivityListComponent },
];
