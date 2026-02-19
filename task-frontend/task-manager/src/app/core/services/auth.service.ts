import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '../../shared/models/auth.model';

const TOKEN_KEY = 'auth_token';
const EXPIRES_AT_KEY = 'auth_expires_at';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/api/auth`;

  login(req: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, req).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        const expiresAt = Date.now() + res.expiresIn * 1000;
        localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
      })
    );
  }

  register(req: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, req);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
    if (!expiresAt) return false;
    return Date.now() < Number(expiresAt);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
