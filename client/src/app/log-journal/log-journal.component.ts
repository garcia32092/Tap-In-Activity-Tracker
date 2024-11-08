import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-journal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './log-journal.component.html',
  styleUrl: './log-journal.component.css'
})
export class LogJournalComponent implements OnInit {
  journalForm!: FormGroup;
  showSuccessMessage = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const now = new Date();

    // Set the current date and time for form defaults
    const localDate = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
    const localTime = now.toTimeString().split(':').slice(0, 2).join(':'); // Format HH:mm

    // Initialize the form with default values
    this.journalForm = this.fb.group({
      journalEntry: ['', Validators.required],
      date: [localDate, Validators.required],
      time: [localTime, Validators.required],
    });
  }

  submitJournal() {
    if (this.journalForm.valid) {
      const formData = this.journalForm.value;
      console.log('Journal Entry:', {
        entry: formData.journalEntry,
        date: formData.date,
        time: formData.time
      });
      
      this.showSuccessMessage = true;
      setTimeout(() => this.showSuccessMessage = false, 4000);

      // Reset form after submission
      this.journalForm.reset({
        journalEntry: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(':').slice(0, 2).join(':')
      });
    }
  }
}