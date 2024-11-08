import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf and ngFor
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { activities, getActivityData } from '../shared/utils/activity-data';
import { ActivityService } from '../shared/services/activity.service';

@Component({
  selector: 'app-log-selection',
  standalone: true,
  imports: [RouterModule, CommonModule], // Ensure CommonModule is imported here
  templateUrl: './log-selection.component.html',
  styleUrls: ['./log-selection.component.css']
})
export class LogSelectionComponent {
  predefinedActivities = activities.map(activity => ({
    name: activity,
    inProgress: false,
    startTime: null as Date | null,  // Set startTime as nullable Date type
    ...getActivityData(activity)  // Use helper function to get category and color
  }));

  constructor(private activityService: ActivityService) {}

  startActivity(activityName: string) {
    const activity = this.predefinedActivities.find(act => act.name === activityName);
    if (activity) {
      const startTime = new Date();
      activity.inProgress = true;
      activity.startTime = startTime;

      this.activityService.logActivity({
        activity: activityName,
        category: activity.category,
        start: this.formatTime(startTime),
        activityDate: this.formatDate(startTime),
        end: null,
        color: activity.color,
        description: ''
      }).subscribe(() => console.log(`${activityName} started at ${startTime}`));
    }
  }

  endActivity(activityName: string) {
    const activity = this.predefinedActivities.find(act => act.name === activityName);
    if (activity && activity.startTime) { // Ensure startTime is not null
      const endTime = new Date();
      this.activityService.logActivity({
        activity: activityName,
        category: activity.category,
        start: this.formatTime(activity.startTime), // Now type-safe
        end: this.formatTime(endTime),
        activityDate: this.formatDate(endTime),
        color: activity.color,
        description: ''
      }).subscribe(() => console.log(`${activityName} ended at ${endTime}`));

      activity.inProgress = false;
      activity.startTime = null;
    }
  }

  formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
