import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-smallwins',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './log-smallwins.component.html',
  styleUrls: ['./log-smallwins.component.css']
})
export class LogSmallWinsComponent implements OnInit {
  winsForm!: FormGroup;
  showSuccessMessage = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const now = new Date();

    const localDate = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');

    // Initialize the form with the fields for small wins
    this.winsForm = this.fb.group({
      gratitude1: ['', Validators.required],
      gratitude2: ['', Validators.required],
      gratitude3: ['', Validators.required],
      goal1: ['', Validators.required],
      goal2: ['', Validators.required],
      goal3: ['', Validators.required],
      exercise: ['', Validators.required],
      education: ['', Validators.required],
      socialMedia: ['', Validators.required],
      music: ['', Validators.required],
      allGoals: ['', Validators.required],
      date: [localDate, Validators.required],
    });
  }

  submitWins() {
    if (this.winsForm.valid) {
      const formData = this.winsForm.value;
      console.log('Small Wins Logged:', formData);
  
      this.showSuccessMessage = true;
      setTimeout(() => this.showSuccessMessage = false, 4000);
  
      const now = new Date();
    
      const localDate = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0');
  
      // Reset form after submission
      this.winsForm.reset({
        gratitude1: '',
        gratitude2: '',
        gratitude3: '',
        goal1: '',
        goal2: '',
        goal3: '',
        exercise: '',
        education: '',
        socialMedia: '',
        music: '',
        allGoals: '',
        date: localDate
      });
    }
  }  
}
