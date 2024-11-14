import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/activities`; // Use environment-specific API URL

  constructor(private http: HttpClient) {}

  logActivity(activity: any): Observable<any> {
    return this.http.post(this.apiUrl, activity);
  }

  getActivities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  updateActivity(activity: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${activity.id}`, activity);
  }

  deleteActivity(activityId: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${activityId}`);
  }

  getTodayActivities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/today`);
  }

  getActivitiesByRange(range: 'day' | 'week' | 'month' | 'year'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/range?range=${range}`);
  }

  getActivitiesByCustomRange(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.apiUrl}/range`, { params });
  }
}
