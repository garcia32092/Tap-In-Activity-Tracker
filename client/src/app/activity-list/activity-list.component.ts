import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  templateUrl: './activity-list.component.html',
  imports: [CommonModule],
})
export class ActivityListComponent implements OnInit {
  activities: any[] = [];

  constructor(private activityService: ActivityService) {}

  ngOnInit() {
    this.activityService.getActivities().subscribe((data) => {
      console.log('Activities received:', data); // Add this line to log the data
      this.activities = data;
    }, (error) => {
      console.error('Error fetching activities:', error);
    });
  }
}
