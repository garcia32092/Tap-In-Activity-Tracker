import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarModule, CalendarUtils, DateAdapter, CalendarA11y, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';  // Import the adapterFactory from date-fns
import { Subject } from 'rxjs';

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
