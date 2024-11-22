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
  selectedRange: 'day' | 'week' | 'month' | 'year' = 'day';
  selectedChartType: 'pie' | 'doughnut' | 'line' | 'bar' = 'pie';
  isCustomRange = false;
  includeTimeNotLogged = true; // Toggle for "Time Not Logged"
  dateRangeForm!: FormGroup;
  chart!: Chart<'pie' | 'doughnut' | 'line' | 'bar', number[], string>;

  constructor(private fb: FormBuilder, private activityService: ActivityService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.dateRangeForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      includeTimeNotLogged: [this.includeTimeNotLogged]
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
            legend: { display: true, position: 'bottom' }
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
      this.chart.destroy();
    }
    this.initializeChart();
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

  onIncludeTimeNotLoggedChange(event: Event): void {
    this.includeTimeNotLogged = (event.target as HTMLInputElement).checked;
    this.updateChartForRange(this.selectedRange);
  }

  updateChartForRange(range: 'day' | 'week' | 'month' | 'year'): void {
    this.activityService.getActivitiesByRange(range).subscribe((data: any[]) => {
      this.updateChartData(data, range);
    });
  }

  updateChartForCustomRange(start: string, end: string): void {
    this.activityService.getActivitiesByCustomRange(start, end).subscribe((data: any[]) => {
      this.updateChartData(data);
    });
  }

  updateChartData(data: any[], range?: 'day' | 'week' | 'month' | 'year'): void {
    if (this.chart) {
        const rangeMinutes = {
            day: 1440,
            week: 10080,
            month: 43200,
            year: 525600
        };
        
        const totalRangeMinutes = range ? rangeMinutes[range] : 0;
        const totalLoggedMinutes = data.reduce((sum, item) => sum + (parseFloat(item.total_duration) || 0), 0);
        const timeNotLogged = totalRangeMinutes - totalLoggedMinutes;

        let totalMinutesForPercentage = this.includeTimeNotLogged ? totalRangeMinutes : totalLoggedMinutes;

        // Set chart data for each category
        const labels = data.map(item => item.category);
        const values = data.map(item => +((parseFloat(item.total_duration) / totalMinutesForPercentage) * 100).toFixed(2));
        const colors = data.map(item => item.color || '#cccccc');

        // Add "Time Not Logged" if enabled and valid
        if (this.includeTimeNotLogged && timeNotLogged > 0) {
            labels.push('Time Not Logged');
            values.push(+((timeNotLogged / totalMinutesForPercentage) * 100).toFixed(2));
            colors.push('#e0e0e0'); // Default color for "Time Not Logged"
        }

        // Update the chart
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = values;
        this.chart.data.datasets[0].backgroundColor = colors;
        this.chart.update();
    }
  }
}
