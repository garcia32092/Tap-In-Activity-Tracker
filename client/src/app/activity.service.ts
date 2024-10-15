import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private apiUrl = 'http://localhost:3000/api/activities'; // Example API URL

  constructor(private http: HttpClient) {}

  logActivity(activity: any): Observable<any> {
    return this.http.post(this.apiUrl, activity);
  }

  getActivities(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
