import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'app-log-activity',
  standalone: true,
  imports: [ReactiveFormsModule], // No need to import HttpClient here
  templateUrl: './log-activity.component.html',
})
export class LogActivityComponent {
  activityForm: FormGroup;

  constructor(private fb: FormBuilder, private activityService: ActivityService) {
    this.activityForm = this.fb.group({
      activity: [''],
      category: [''],
      hour: [''],
    });
  }

  logActivity() {
    const formData = this.activityForm.value;
    this.activityService.logActivity(formData).subscribe(() => {
      alert('Activity logged successfully!');
      this.activityForm.reset();
    });
  }
}
