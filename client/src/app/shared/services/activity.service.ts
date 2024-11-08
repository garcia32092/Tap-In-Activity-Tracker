import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<any[]>(this.apiUrl);
  }

  updateActivity(activity: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${activity.id}`, activity);
  }

  deleteActivity(activityId: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${activityId}`);
  }
}
