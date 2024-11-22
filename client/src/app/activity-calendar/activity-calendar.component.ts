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
import { combineDateAndTime, formatDateForDatabase, formatDateForInput, formatTimeForDatabase } from '../shared/utils/date-utils';
import { activities, activityToCategory, categories, categoryColors, getActivityData } from '../shared/utils/activity-data';

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
  @ViewChild('confirmDeleteModal', { static: true }) confirmDeleteModal!: TemplateRef<any>;
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  modalData: { action: string; event: CustomCalendarEvent; startInput?: string; endInput?: string } = {
    action: '',
    event: {
      start: new Date(),
      title: '',
      color: { primary: '#000000', secondary: '#FFFFFF' },
      allDay: false,
      resizable: {
        afterEnd: false,
        beforeStart: false,
      },
      draggable: false,
      meta: { description: '' },
      category: ''
    } as CustomCalendarEvent,
  };
  activities = activities;
  categories = categories;
  activityToCategory: Record<string, string> = activityToCategory;
  categoryColors: Record<string, string> = categoryColors;
  primaryColor: string = '#000000';
  refresh = new Subject<void>();
  dayClickTimeout: any;
  eventClickTimeout: any;
  selectedEventToDelete: CustomCalendarEvent | null = null;
  isResizable: boolean = false;

  constructor(private activityService: ActivityService, private modal: NgbModal) {} // Inject the ActivityService

  ngOnInit() {
    // Fetch activities from the ActivityService
    this.initializeResizable();
    this.getActivities();
  }

  getActivities() {
    this.activityService.getActivities().subscribe(
      (data: any[]) => {
        console.log('Activities received:', data);
  
        // Map the activities to the CalendarEvent format expected by angular-calendar
        this.events = data.map((activity) => {
          // Parse the activity_date as a Date object
          const activityStartDate = new Date(activity.activity_start_date);
          const activityEndDate = new Date(activity.activity_end_date);
  
          // Create full start and end Date objects by combining activity_date with start_time and end_time
          const startTime = combineDateAndTime(activityStartDate, activity.start_time);
          const endTime = combineDateAndTime(activityEndDate, activity.end_time);
  
          return {
            id: activity.id,
            title: activity.activity, // Activity name as the event title
            start: startTime, // Combined date and start time
            end: endTime, // Combined date and end time
            color: {
              primary: activity.color,
              secondary: this.adjustColorBrightness(activity.color, 1.3, 0.3)
            },
            actions: this.actions, // Action icons for edit/delete
            allDay: activity.allday,
            resizable: {
              beforeStart: activity.resizable_beforestart,
              afterEnd: activity.resizable_afterend,
            },
            draggable: activity.draggable,
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

  // Utility function to adjust color brightness for secondary shade
  adjustColorBrightness(color: string, factor: number, alpha: number = 1): string {
    const [r, g, b] = color.match(/\w\w/g)!.map(hex => parseInt(hex, 16));
    const adjust = (channel: number) => Math.min(255, Math.floor(channel * factor));
  
    // Apply the brightness adjustment and include alpha
    return `rgba(${adjust(r)}, ${adjust(g)}, ${adjust(b)}, ${alpha})`;
  }

  initializeResizable() {
    // Set isResizable based on the current values of beforeStart and afterEnd
    this.isResizable = !!(
      this.modalData.event.resizable &&
      this.modalData.event.resizable.beforeStart &&
      this.modalData.event.resizable.afterEnd
    );
  
    if (!this.modalData.event.resizable) {
      this.modalData.event.resizable = { beforeStart: false, afterEnd: false };
    }
  }
  
  toggleResizable() {
    // Ensure that resizable is defined
    if (!this.modalData.event.resizable) {
      this.modalData.event.resizable = { beforeStart: false, afterEnd: false };
    }
  
    // Update both resizable.beforeStart and resizable.afterEnd based on isResizable
    this.modalData.event.resizable.beforeStart = this.isResizable;
    this.modalData.event.resizable.afterEnd = this.isResizable;
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

  events: CustomCalendarEvent[] = [];

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
    const { title, category, start, end, meta, color } = event;
    this.modalData = {
      action: 'Edit Activity',
      event: {
        ...event,
        title: title || '',
        category: category || '',
        meta: meta || { description: '' },
        color: color || { primary: '#000000', secondary: '#FFFFFF' }, // Ensure color is initialized
      },
      startInput: formatDateForInput(start),
      endInput: formatDateForInput(end),
    };
    this.primaryColor = this.modalData.event.color?.primary || '#00000';
    this.modal.open(this.modalContent, { size: 'lg' });
  }
  
  timeClicked(date: Date) {
    if (this.eventClickTimeout) {
      clearTimeout(this.eventClickTimeout);
      this.eventClickTimeout = null;
      const defaultColor = { primary: '#000000', secondary: '#FFFFFF' };
    
      this.modalData = {
        action: 'Add Activity',
        event: {
          title: '',
          category: '',
          start: date,
          end: new Date(date.getTime() + 60 * 60 * 1000), // Default to 1 hour later
          color: defaultColor,
          meta: { description: '' },
          allDay: false,
          resizable: { beforeStart: false, afterEnd: false },
          draggable: false,
        },
        startInput: formatDateForInput(date),
        endInput: formatDateForInput(new Date(date.getTime() + 60 * 60 * 1000)),
      };
      this.primaryColor = defaultColor.primary;
      this.modal.open(this.modalContent, { size: 'lg' });
    } else {
      // Single click: Just log the clicked time
      this.eventClickTimeout = setTimeout(() => {
        this.eventClickTimeout = null;
        console.log('Time clicked', date);
      }, 300);
    }
  }

  handleEvent(action: string, event: CustomCalendarEvent): void {
    if (action === 'Edit' || action === 'View Details') {
      this.modalData = { event, action };
      this.modal.open(this.modalContent, { size: 'lg' });
    }
  }
  
  saveChanges() {
    const isNewActivity = !this.modalData.event.id;
  
    this.modalData.event.start = new Date(this.modalData.startInput || '');
    this.modalData.event.end = new Date(this.modalData.endInput || '');
    this.modalData.event.color = {
      primary: this.primaryColor,
      secondary: this.adjustColorBrightness(this.primaryColor, 1.3, 0.3),
    };

    const activityName = this.modalData.event.title === 'Other' ? this.modalData.event.meta.customActivity : this.modalData.event.title;
    const categoryName = this.modalData.event.category === 'Other' ? this.modalData.event.meta.customCategory : this.modalData.event.category;
  
    if (isNewActivity) {
      // Create new activity
      this.activityService.logActivity({
        activity: activityName,
        category: categoryName,
        description: this.modalData.event.meta.description,
        activityStartDate: formatDateForDatabase(this.modalData.event.start),
        activityEndDate: formatDateForDatabase(this.modalData.event.end),
        start: formatTimeForDatabase(this.modalData.event.start),
        end: formatTimeForDatabase(this.modalData.event.end),
        color: this.modalData.event.color.primary,
        allDay: this.modalData.event.allDay,
        draggable: this.modalData.event.draggable,
        resizable_beforeStart: this.modalData.event.resizable?.beforeStart,
        resizable_afterEnd: this.modalData.event.resizable?.afterEnd,
        inProgress: false,
      }).subscribe(
        (newActivity) => {
          this.events.push({
            ...newActivity,
            start: this.modalData.event.start,
            end: this.modalData.event.end,
          });
          console.log('New activity added:', newActivity);
          this.refresh.next();
          this.modal.dismissAll();
          this.getActivities();
        },
        (error) => console.error('Error adding new activity:', error)
      );
    } else {
      // Update existing activity
      this.activityService.updateActivity(this.modalData.event).subscribe(
        (updatedEvent) => {
          this.events = this.events.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
          );
          console.log('Event saved:', updatedEvent);
          this.refresh.next();
          this.modal.dismissAll();
          this.getActivities();
        },
        (error) => console.error('Error updating activity:', error)
      );
    }
  }  

  openDeleteConfirmation(event: CustomCalendarEvent) {
    this.selectedEventToDelete = event;
    this.modal.open(this.confirmDeleteModal, { size: 'sm' });
  }

  confirmDelete() {
    if (this.selectedEventToDelete) {
      this.activityService.deleteActivity(this.selectedEventToDelete.id!).subscribe(
        () => {
          // Re-fetch all activities from the server after deletion
          this.getActivities();
        },
        (error) => {
          console.error('Error deleting activity:', error);
        }
      );
    }
    this.modal.dismissAll();
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

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
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
    console.log('Dropped or resized', event);
  
    if (event.id !== undefined && newStart && newEnd) {
      this.updateEventTime(Number(event.id), newStart, newEnd); // Cast event.id to number
    } else {
      console.error('Event ID, newStart, or newEnd is undefined, cannot update time in backend.');
    }
  }

  updateEventTime(eventId: number, newStart: Date, newEnd: Date) {
    const formattedStartDate = formatDateForDatabase(newStart);
    const formattedEndDate = formatDateForDatabase(newEnd);
    const formattedStartTime = formatTimeForDatabase(newStart);
    const formattedEndTime = formatTimeForDatabase(newEnd);
    console.log(formattedStartDate, formattedEndDate, formattedStartTime, formattedEndTime);
  
    // Call the ActivityService to update the event time in the backend
    this.activityService.updateEventTime(eventId, formattedStartDate, formattedEndDate, formattedStartTime, formattedEndTime).subscribe(
      (response) => {
        console.log('Event time updated successfully:', response);
      },
      (error) => {
        console.error('Error updating event time:', error);
      }
    );
  }

  checkActivity(event: any) {
    const selectedActivity = event.target.value;
  
    if (selectedActivity === 'Other') {
      this.modalData.event.category = ''; // Reset category for custom activities
      this.modalData.event.color = { primary: '#000000', secondary: '#FFFFFF' }; // Default color for custom activities
    } else {
      const { category, color } = getActivityData(selectedActivity);
      this.modalData.event.category = category;
      this.modalData.event.color = { primary: color, secondary: this.adjustColorBrightness(color, 1.3, 0.3) };
    }

    // Update the primary color for the color picker
    this.primaryColor = this.modalData.event.color?.primary || '#00000';
  }
  
  checkCategory(event: any) {
    const selectedCategory = event.target.value;
    const isCustomCategory = selectedCategory === 'Other';
  
    if (!isCustomCategory) {
      const color = categoryColors[selectedCategory];
      this.modalData.event.color = { primary: color, secondary: this.adjustColorBrightness(color, 1.3, 0.3) };
    }

    // Update the primary color for the color picker
    this.primaryColor = this.modalData.event.color?.primary || '#00000';
  }
}
