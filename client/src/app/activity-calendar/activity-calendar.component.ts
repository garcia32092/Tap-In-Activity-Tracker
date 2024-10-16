import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CalendarEvent,
  CalendarView,
  CalendarModule,
  CalendarUtils,
  DateAdapter,
  CalendarA11y,
  CalendarDateFormatter,
  CalendarEventTitleFormatter
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'; // Import the adapterFactory from date-fns
import { Subject } from 'rxjs';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'app-activity-calendar',
  standalone: true,
  templateUrl: './activity-calendar.component.html',
  styleUrls: ['./activity-calendar.component.css'],
  imports: [CommonModule, CalendarModule],
  providers: [
    CalendarUtils,
    CalendarA11y, // Provide the CalendarA11y service
    CalendarDateFormatter, // Provide the CalendarDateFormatter service
    CalendarEventTitleFormatter, // Provide the CalendarEventTitleFormatter service
    {
      provide: DateAdapter,
      useFactory: adapterFactory // Use the date-fns adapter factory
    }
  ]
})
export class ActivityCalendarComponent {
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();

  constructor(private activityService: ActivityService) {} // Inject the ActivityService

  ngOnInit() {
    this.activityService.getActivities().subscribe((data: any[]) => {
      console.log('Activities received:', data);
      // Map the activities to the CalendarEvent format
      this.events = data.map(activity => ({
        title: activity.activity, // Assuming the activity has a name field
        start: new Date(activity.date), // Assuming each activity has a date field
        color: {
          primary: '#1e90ff',
          secondary: '#D1E8FF',
        }
      }));
      this.refresh.next(null); // Trigger calendar refresh
    }, (error) => {
      console.error('Error fetching activities:', error);
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({ date }: { date: Date }): void {
    this.viewDate = date;
  }

  eventClicked(event: CalendarEvent): void {
    console.log('Event clicked', event);
  }
}
