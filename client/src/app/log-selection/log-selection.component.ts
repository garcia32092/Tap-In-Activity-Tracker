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
  groupedActivities: { [key: string]: any[] } = {};

  toggles = {
    exercise: false,
    education: false,
    socialMedia: false,
    music: false,
    allGoals: false,
  };

  constructor(private activityService: ActivityService) {}

  ngOnInit() {
    this.groupActivitiesByCategory();
    this.loadTodayActivities();
  }

  groupActivitiesByCategory() {
    activities.forEach(activity => {
      const { category, color } = getActivityData(activity);

      // Initialize the category array if it doesn't exist
      if (!this.groupedActivities[category]) {
        this.groupedActivities[category] = [];
      }

      // Push the activity with its details into the appropriate category
      this.groupedActivities[category].push({
        name: activity,
        inProgress: false,
        startTime: null as Date | null,
        color
      });
    });
  }

  loadTodayActivities() {
    this.activityService.getTodayActivities().subscribe((activities) => {
      this.toggles.exercise = activities.some(activity => activity.category === 'Health & Fitness');
      this.toggles.education = activities.some(activity => activity.category === 'Education & Study');
      this.toggles.socialMedia = activities.some(activity => activity.activity === 'Social Media');
      this.toggles.music = activities.some(activity => activity.activity === 'Making Music');
      this.toggles.allGoals = this.toggles.education && this.toggles.exercise && this.toggles.music && this.toggles.socialMedia;
    });
  }

  startActivity(activityName: string) {
    const activity = Object.values(this.groupedActivities).flat().find(act => act.name === activityName);
    if (activity) {
      const now = new Date();
  
      activity.inProgress = true;
      activity.startTime = now;
  
      this.activityService.logActivity({
        activity: activityName,
        category: getActivityData(activityName).category,
        start: this.formatLocalTime(now),
        activityDate: this.formatLocalDate(now),
        end: null,
        color: activity.color,
        description: ''
      }).subscribe(() => console.log(`${activityName} started at ${this.formatLocalDate(now)}`));
    }
  }
  
  endActivity(activityName: string) {
    const activity = Object.values(this.groupedActivities).flat().find(act => act.name === activityName);
    if (activity && activity.startTime) {
      const now = new Date();
      this.activityService.logActivity({
        activity: activityName,
        category: getActivityData(activityName).category,
        start: this.formatLocalTime(activity.startTime),
        end: this.formatLocalTime(now),
        activityDate: this.formatLocalDate(now),
        color: activity.color,
        description: ''
      }).subscribe(() => console.log(`${activityName} ended at ${this.formatLocalDate(now)}`));
  
      activity.inProgress = false;
      activity.startTime = null;
    }
  }
  
  // Format to local time
  formatLocalTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Format to local date
  formatLocalDate(date: Date): string {
    return date.toLocaleDateString('en-CA'); // 'en-CA' for YYYY-MM-DD format
  }  
}