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
      const startTime = new Date();
      activity.inProgress = true;
      activity.startTime = startTime;

      this.activityService.logActivity({
        activity: activityName,
        category: getActivityData(activityName).category,
        start: this.formatTime(startTime),
        activityDate: this.formatDate(startTime),
        end: null,
        color: activity.color,
        description: ''
      }).subscribe(() => console.log(`${activityName} started at ${startTime}`));
    }
  }

  endActivity(activityName: string) {
    const activity = Object.values(this.groupedActivities).flat().find(act => act.name === activityName);
    if (activity && activity.startTime) {
      const endTime = new Date();
      this.activityService.logActivity({
        activity: activityName,
        category: getActivityData(activityName).category,
        start: this.formatTime(activity.startTime),
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