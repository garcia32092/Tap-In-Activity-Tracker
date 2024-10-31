import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  CalendarEventAction,
  CalendarView,
  CalendarModule,
  CalendarUtils,
  DateAdapter,
  CalendarA11y,
  CalendarDateFormatter,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter
} from 'angular-calendar';
import { CustomCalendarEvent } from '../shared/models/custom-calendar-event.model';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ActivityService } from '../shared/services/activity.service';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { EventColor } from 'calendar-utils';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-activity-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './activity-calendar.component.html',
  styleUrls: ['./activity-calendar.component.css'],
  imports: [CommonModule, CalendarModule, FormsModule],
  providers: [
    CalendarUtils,
    CalendarA11y, // Provide the CalendarA11y service
    CalendarDateFormatter, // Provide the CalendarDateFormatter service
    CalendarEventTitleFormatter,
    {
      provide: DateAdapter, 
      useFactory: adapterFactory // Use the date-fns adapter factory
    }
  ]
})
export class ActivityCalendarComponent {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  modalData: { action: string; event: CustomCalendarEvent; startInput?: string; endInput?: string } = {
    action: '',
    event: {
      start: new Date(),
      title: '',
      color: { primary: '#000000', secondary: '#FFFFFF' },
      meta: { description: '' },
      category: ''
    } as CustomCalendarEvent,
  };  
  primaryColor: string = '#000000';
  refresh = new Subject<void>();
  dayClickTimeout: any;
  eventClickTimeout: any;

  constructor(private activityService: ActivityService, private modal: NgbModal) {} // Inject the ActivityService

  ngOnInit() {
    // Fetch activities from the ActivityService
    this.activityService.getActivities().subscribe(
      (data: any[]) => {
        console.log('Activities received:', data);
  
        // Map the activities to the CalendarEvent format expected by angular-calendar
        this.events = data.map((activity) => {
          // Parse the activity_date as a Date object
          const activityDate = new Date(activity.activity_date);
  
          // Create full start and end Date objects by combining activity_date with start_time and end_time
          const startTime = this.combineDateAndTime(activityDate, activity.start_time);
          const endTime = this.combineDateAndTime(activityDate, activity.end_time);
  
          return {
            title: activity.activity, // Activity name as the event title
            start: startTime, // Combined date and start time
            end: endTime, // Combined date and end time
            color: {
              primary: activity.color,
              secondary: this.adjustColorBrightness(activity.color, 1.3, 0.3)
            },
            actions: this.actions, // Action icons for edit/delete
            meta: {
              description: activity.description
            },
            category: activity.category
          };
        });
  
        // Trigger calendar refresh
        this.refresh.next();
      },
      (error) => {
        console.error('Error fetching activities:', error);
      }
    );
  }

  // Helper function to combine date and time into a single Date object
  combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, seconds || 0);
    return combinedDate;
  }

  // Utility function to adjust color brightness for secondary shade
  adjustColorBrightness(color: string, factor: number, alpha: number = 1): string {
    const [r, g, b] = color.match(/\w\w/g)!.map(hex => parseInt(hex, 16));
    const adjust = (channel: number) => Math.min(255, Math.floor(channel * factor));
  
    // Apply the brightness adjustment and include alpha
    return `rgba(${adjust(r)}, ${adjust(g)}, ${adjust(b)}, ${alpha})`;
  }  

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CustomCalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CustomCalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  events: CustomCalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors['red'],
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors['yellow'],
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors['blue'],
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors['yellow'],
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  setView(view: CalendarView) {
    this.view = view;
  }

  eventClicked(event: CustomCalendarEvent): void {
    if (this.eventClickTimeout) {
      clearTimeout(this.eventClickTimeout);
      this.eventClickTimeout = null;
      this.eventDoubleClicked(event);
    } else {
      this.eventClickTimeout = setTimeout(() => {
        this.eventClickTimeout = null;
        console.log('Single event click detected:', event);
        // Optionally handle single-click action here, if needed
      }, 300); // Adjust timeout for double-click detection
    }
  }
  
  eventDoubleClicked(event: CustomCalendarEvent): void {
    this.modalData = {
      action: 'View Details',
      event: { ...event },
      startInput: this.formatDateForInput(event.start),
      endInput: this.formatDateForInput(event.end)
    };
    this.primaryColor = this.modalData.event.color?.primary || '#000000';
    this.modal.open(this.modalContent, { size: 'lg' });
  }  

  private formatDateForInput(date: Date | undefined): string {
    if (!date) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }  

  handleEvent(action: string, event: CustomCalendarEvent): void {
    if (action === 'Edit' || action === 'View Details') {
      this.modalData = { event, action };
      this.modal.open(this.modalContent, { size: 'lg' });
    }
  }
  
  saveChanges() {
    this.modalData.event.start = new Date(this.modalData.startInput || '');
    this.modalData.event.end = new Date(this.modalData.endInput || '');
  
    this.events = this.events.map(event => 
      event === this.modalData.event ? { ...event, ...this.modalData.event } : event
    );
    
    this.refresh.next();
    
    // Optionally, update on the backend:
    // this.activityService.updateActivity(this.modalData.event).subscribe();
    
    this.modal.dismissAll();
  }
  
  deleteEvent(eventToDelete: CustomCalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
    this.refresh.next();
    
    // Optionally, delete from backend:
    // this.activityService.deleteActivity(eventToDelete.id).subscribe();
    
    this.modal.dismissAll();
  }  
  
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CustomCalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      // Check for double-click
      if (this.dayClickTimeout) {
        clearTimeout(this.dayClickTimeout);
        this.dayClickTimeout = null;
  
        // Switch to day view on double-click
        this.view = CalendarView.Day;
        this.viewDate = date;
      } else {
        // Single-click behavior
        this.dayClickTimeout = setTimeout(() => {
          this.dayClickTimeout = null;
          if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen) || events.length === 0) {
            this.activeDayIsOpen = false;
          } else {
            this.activeDayIsOpen = true;
          }
          this.viewDate = date;
        }, 300); // Adjust the timeout duration as needed
      }
    }
    console.log('Day clicked', date);
  }

  timeClicked(date: Date) {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
    }
    console.log('Time clicked', date);
  };

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }  
}
