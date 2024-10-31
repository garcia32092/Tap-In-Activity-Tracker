import { CalendarEvent } from 'angular-calendar';

export interface CustomCalendarEvent extends CalendarEvent {
  category?: string;
  // Add other custom fields as needed
}
