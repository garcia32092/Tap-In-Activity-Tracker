import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivityService } from '../activity.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-log-activity',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // No need to import HttpClient here
  templateUrl: './log-activity.component.html',
  styleUrls: ['./log-activity.component.css']
})
export class LogActivityComponent implements OnInit {
  activityForm!: FormGroup;
  activities: string[] = ['Running', 'Cycling', 'Swimming', 'Yoga'];
  categories: string[] = ['Exercise', 'Work', 'Leisure', 'Study'];
  showCustomActivity = false;
  showCustomCategory = false;

  constructor(private fb: FormBuilder, private activityService: ActivityService) {}

  ngOnInit() {
    const now = new Date();
  
    // Format the current date as YYYY-MM-DD without converting to UTC
    const localDate = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
  
    // Get the most recent past hour (e.g., if it's 5:30pm, set it to 5:00pm)
    const mostRecentHour = new Date(now);
    mostRecentHour.setMinutes(0, 0, 0); // Set minutes and seconds to zero for a full hour
    const nextHour = new Date(mostRecentHour);
    nextHour.setHours(nextHour.getHours() + 1); // Set the end time to the next full hour
  
    // Initialize form with local time defaults
    this.activityForm = this.fb.group({
      activity: ['', Validators.required],
      customActivity: [''],
      category: ['', Validators.required],
      customCategory: [''],
      activityDate: [localDate, Validators.required], // Set default date to current local date
      start: [mostRecentHour.toTimeString().split(':').slice(0, 2).join(':'), Validators.required], // HH:mm format
      end: [nextHour.toTimeString().split(':').slice(0, 2).join(':'), Validators.required], // HH:mm format
      description: [''] // Optional description field
    });
  }

  checkActivity(event: any) {
    this.showCustomActivity = event.target.value === 'Other';
    if (!this.showCustomActivity) {
      this.activityForm.get('customActivity')?.reset();
    }
  }

  checkCategory(event: any) {
    this.showCustomCategory = event.target.value === 'Other';
    if (!this.showCustomCategory) {
      this.activityForm.get('customCategory')?.reset();
    }
  }

  logActivity() {
    const formData = this.activityForm.value;
    const activity = this.showCustomActivity ? formData.customActivity : formData.activity;
    const category = this.showCustomCategory ? formData.customCategory : formData.category;
  
    console.log('Logging Activity:', {
      activity,
      category,
      date: formData.activityDate,
      start: formData.start,
      end: formData.end,
      description: formData.description // Add the description field
    });
  
    this.activityService.logActivity({
      activity,
      category,
      description: formData.description,
      start: formData.start,
      end: formData.end,
      activityDate: formData.activityDate,
    }).subscribe(() => {
      alert('Activity logged successfully!');
      this.activityForm.reset();
    });
  }
}
