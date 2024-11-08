import { Routes } from '@angular/router';
import { ActivityCalendarComponent } from './activity-calendar/activity-calendar.component';
import { LogActivityComponent } from './log-activity/log-activity.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { LogSelectionComponent } from './log-selection/log-selection.component';
import { LogJournalComponent } from './log-journal/log-journal.component';
import { LogSmallWinsComponent } from './log-smallwins/log-smallwins.component';

export const routes: Routes = [
  { path: '', component: LogSelectionComponent },
  { path: 'calendar', component: ActivityCalendarComponent },
  { path: 'list', component: ActivityListComponent },
  { path: 'log-activity', component: LogActivityComponent },
  { path: 'log-journal', component: LogJournalComponent },
  { path: 'log-small-wins', component: LogSmallWinsComponent },
  { path: '**', redirectTo: '' },
];
