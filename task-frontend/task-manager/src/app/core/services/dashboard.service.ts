import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardResponse } from '../../shared/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/dashboard`;

  getMySummary(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrl}/user`);
  }

  getGlobalSummary(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrl}/total`);
  }
}
