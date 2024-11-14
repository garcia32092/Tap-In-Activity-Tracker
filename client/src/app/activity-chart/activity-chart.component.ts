import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables, ChartType } from 'chart.js';
import { ActivityService } from '../shared/services/activity.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-chart.component.html',
  styleUrls: ['./activity-chart.component.css']
})
export class ActivityChartComponent implements OnInit {
  @ViewChild('activityChart', { static: true }) activityChartRef!: ElementRef<HTMLCanvasElement>;
  selectedRange: 'day' | 'week' | 'month' | 'year' = 'month'; // Custom removed here
  selectedChartType: 'pie' | 'doughnut' | 'line' | 'bar' = 'pie';
  isCustomRange = false; // New boolean for custom range handling
  dateRangeForm!: FormGroup;
  chart!: Chart<'pie' | 'doughnut' | 'line' | 'bar', number[], string>;

  constructor(private fb: FormBuilder, private activityService: ActivityService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.dateRangeForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
    this.initializeChart();
    this.updateChartForRange(this.selectedRange);
  }

  initializeChart() {
    const ctx = this.activityChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: this.selectedChartType,
        data: {
          labels: [],
          datasets: [{
            label: 'Time Spent (%)',
            data: [],
            backgroundColor: []
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top' }
          },
        }
      });
    }
  }

  onRangeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    if (selectedValue === 'custom') {
      this.isCustomRange = true;
      const { startDate, endDate } = this.dateRangeForm.value;
      if (startDate && endDate) {
        this.updateChartForCustomRange(startDate, endDate);
      }
    } else {
      this.isCustomRange = false;
      this.selectedRange = selectedValue as 'day' | 'week' | 'month' | 'year';
      this.updateChartForRange(this.selectedRange);
    }
  }

  onChartTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedChartType = target.value as 'pie' | 'doughnut' | 'line' | 'bar';

    if (this.chart) {
      this.chart.destroy(); // Destroy the existing chart instance
    }
    this.initializeChart(); // Re-initialize with the new chart type

    if (!this.isCustomRange) {
      this.updateChartForRange(this.selectedRange);
    } else {
      const { startDate, endDate } = this.dateRangeForm.value;
      if (startDate && endDate) {
        this.updateChartForCustomRange(startDate, endDate);
      }
    }
  }

  onCustomDateChange(): void {
    const { startDate, endDate } = this.dateRangeForm.value;
    if (startDate && endDate) {
      this.updateChartForCustomRange(startDate, endDate);
    }
  }

  updateChartForRange(range: 'day' | 'week' | 'month' | 'year'): void {
    this.activityService.getActivitiesByRange(range).subscribe((data: any[]) => {
      this.updateChartData(data);
      console.log(`Activities by ${range}:`, data);
    });
  }

  updateChartForCustomRange(start: string, end: string): void {
    this.activityService.getActivitiesByCustomRange(start, end).subscribe((data: any[]) => {
      this.updateChartData(data);
    });
  }

  updateChartData(data: any[]): void {
    if (this.chart) {
        // Calculate `duration_minutes` if not provided
        data.forEach(item => {
            if (!item.duration_minutes && item.start_time && item.end_time) {
                const start = new Date(`1970-01-01T${item.start_time}Z`).getTime();
                const end = new Date(`1970-01-01T${item.end_time}Z`).getTime();
                item.duration_minutes = (end - start) / (1000 * 60); // Convert milliseconds to minutes
            }
        });

        // Recalculate total minutes based on updated `duration_minutes`
        const totalMinutes = data.reduce((sum, item) => sum + (item.duration_minutes || 0), 0);
        console.log('Total Minutes:', totalMinutes);

        if (totalMinutes > 0) {
            // Update chart data only if totalMinutes is valid
            this.chart.data.labels = data.map(item => item.activity);
            this.chart.data.datasets[0].data = data.map(item => 
                +((item.duration_minutes / totalMinutes) * 100).toFixed(2)
            );
            this.chart.data.datasets[0].backgroundColor = data.map(item => item.color || '#cccccc');
        } else {
            console.warn('No data to display, totalMinutes is zero.');
            this.chart.data.labels = [];
            this.chart.data.datasets[0].data = [];
            this.chart.data.datasets[0].backgroundColor = [];
        }

        console.log('Processed chart data:', this.chart.data);
        this.chart.update();
    }
  } 
}
