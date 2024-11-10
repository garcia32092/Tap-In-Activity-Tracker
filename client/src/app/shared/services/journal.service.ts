import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = `${environment.apiUrl}/journals`;

  constructor(private http: HttpClient) {}

  // Method to log a journal entry
  logJournal(journal: any): Observable<any> {
    return this.http.post(this.apiUrl, journal);
  }

  // Method to fetch all journal entries
  getJournals(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
