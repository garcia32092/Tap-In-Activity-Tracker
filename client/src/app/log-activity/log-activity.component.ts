import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivityService } from '../shared/services/activity.service';
import { Validators } from '@angular/forms';
import { activities, categories, activityToCategory, categoryColors } from '../shared/utils/activity-data';
import { formatLocalDate, formatLocalTime } from '../shared/utils/date-utils';

@Component({
  selector: 'app-log-activity',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // No need to import HttpClient here
  templateUrl: './log-activity.component.html',
  styleUrls: ['./log-activity.component.css']
})
export class LogActivityComponent implements OnInit {
  activityForm!: FormGroup;
  activities = activities;
  categories = categories;
  activityToCategory: Record<string, string> = activityToCategory;
  categoryColors: Record<string, string> = categoryColors;
  showCustomActivity = false;
  showCustomCategory = false;
  showSuccessMessage = false;

  constructor(private fb: FormBuilder, private activityService: ActivityService) {}

  ngOnInit() {
    const now = new Date();
  
    // Helper function to format datetime-local values
    const formatDateTimeLocal = (date: Date) => {
      const datePart = formatLocalDate(date); // Format to 'YYYY-MM-DD'
      const timePart = date.toTimeString().slice(0, 5); // Extract 'HH:mm'
      return `${datePart}T${timePart}`; // Combine into 'YYYY-MM-DDTHH:mm'
    };
  
    // Get the most recent past hour and next hour
    const mostRecentHour = new Date(now);
    mostRecentHour.setMinutes(0, 0, 0); // Set minutes and seconds to zero
    const nextHour = new Date(mostRecentHour);
    nextHour.setHours(nextHour.getHours() + 1); // Next full hour
  
    // Initialize form with default datetime-local values
    this.activityForm = this.fb.group({
      activity: ['', Validators.required],
      customActivity: [''],
      category: ['', Validators.required],
      customCategory: [''],
      activityStartDateTime: [formatDateTimeLocal(mostRecentHour), Validators.required], // Combined start date/time
      activityEndDateTime: [formatDateTimeLocal(nextHour), Validators.required], // Combined end date/time
      color: [''],
      description: [''] // Optional description
    });
  }  

  showSuccessNotification() {
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 4000); // Time in milliseconds (4 seconds)
  }

  checkActivity(event: any) {
    const selectedActivity = event.target.value;
    this.showCustomActivity = selectedActivity === 'Other';

    if (!this.showCustomActivity) {
      this.activityForm.get('customActivity')?.reset();

      // Automatically set the category if there's a match
      const mappedCategory = this.activityToCategory[selectedActivity];
      if (mappedCategory) {
        this.activityForm.get('category')?.setValue(mappedCategory);
        this.setCategoryColor(mappedCategory);
      }
    }
  }

  checkCategory(event: any) {
    const selectedCategory = event.target.value;
    this.showCustomCategory = selectedCategory === 'Other';

    if (!this.showCustomCategory) {
      this.activityForm.get('customCategory')?.reset();
      this.setCategoryColor(selectedCategory);
    }
  }

  setCategoryColor(category: string) {
    const mappedColor = this.categoryColors[category];
    this.activityForm.get('color')?.setValue(mappedColor);
  }

  logActivity() {
    const formData = this.activityForm.value;
    const activity = this.showCustomActivity ? formData.customActivity : formData.activity;
    const category = this.showCustomCategory ? formData.customCategory : formData.category;

    console.log('Logging Activity:', {
      activity,
      category,
      startDateTime: formData.activityStartDateTime,
      endDateTime: formData.activityEndDateTime,
      description: formData.description,
      color: formData.color
    });

    this.activityService.logActivity({
      activity,
      category,
      description: formData.description,
      activityStartDate: formData.activityStartDateTime.split('T')[0], // Extract date
      activityEndDate: formData.activityEndDateTime.split('T')[0], // Extract date
      start: formData.activityStartDateTime.split('T')[1], // Extract time
      end: formData.activityEndDateTime.split('T')[1], // Extract time
      color: formData.color
    }).subscribe(() => {
        this.showSuccessNotification();
        this.activityForm.get('activity')?.reset();
        this.activityForm.get('category')?.reset();
        this.activityForm.get('customActivity')?.reset();
        this.activityForm.get('customCategory')?.reset();
        this.activityForm.get('description')?.reset('');
        this.activityForm.get('color')?.reset();
      });
  }
}
