import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf and ngFor
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { activities, getActivityData } from '../shared/utils/activity-data';
import { ActivityService } from '../shared/services/activity.service';
import { combineDateAndTime, formatDateForDatabase, formatTimeForDatabase, formatLocalDate, formatLocalTime } from '../shared/utils/date-utils';

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
        id: -1,
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
  
      // Update the groupedActivities with `inProgress` status
      Object.values(this.groupedActivities).flat().forEach(groupedActivity => {
        const matchingActivity = activities.find(activity => activity.activity === groupedActivity.name);
        console.log('Matching activity:', matchingActivity);
        if (matchingActivity) {
          groupedActivity.id = matchingActivity.id;
          groupedActivity.inProgress = matchingActivity.inprogress;
          console.log('Grouped activity:', groupedActivity);
        }
      });
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
        start: formatLocalTime(now),
        activityStartDate: formatLocalDate(now),
        activityEndDate: formatLocalDate(now),
        end: formatLocalTime(now),
        color: activity.color,
        description: '', 
        inProgress: true, // Set to true when starting
        allDay: false,
        draggable: false,
        resizable_beforeStart: false,
        resizable_afterEnd: false
      }).subscribe(() => console.log(`${activityName} started at ${formatLocalDate(now)}`));
    }
  }
  
  endActivity(activityId: number) {
    if (!activityId) {
      console.error('Activity ID is undefined!');
      return;
    }
  
    this.activityService.getActivityById(activityId).subscribe(
      (activity) => {
        console.log('Activity selected to end:', activity);
        const now = new Date();
  
        // Update the activity
        const updatedActivity = {
          ...activity,
          description: activity.description,
          inProgress: false,
          end_time: formatLocalTime(now),
          activityEndDate: formatLocalDate(now),
        };

        console.log('Activity to update:', updatedActivity);
  
        this.activityService.endActivity(updatedActivity.id, updatedActivity.end_time).subscribe(() => {
          console.log(`Activity ${activity.activity} ended successfully.`);
  
          // Update local state
          const groupedActivity = Object.values(this.groupedActivities).flat().find(
            act => act.id === activityId
          );
          if (groupedActivity) {
            groupedActivity.inProgress = false;
            groupedActivity.startTime = null;
          }
        });
      },
      (error) => {
        console.error('Error fetching activity by ID:', error);
      }
    );
  }
}