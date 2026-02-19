import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should save token and expiresAt in localStorage', () => {
    const mockResponse = { token: 'abc123', expiresIn: 3600 };

    service.login({ email: 'test@test.com', password: '123456' }).subscribe(res => {
      expect(res.token).toBe('abc123');
      expect(localStorage.getItem('auth_token')).toBe('abc123');
      expect(localStorage.getItem('auth_expires_at')).toBeTruthy();
      const expiresAt = Number(localStorage.getItem('auth_expires_at'));
      expect(expiresAt).toBeGreaterThan(Date.now());
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('isAuthenticated should return true when token exists and not expired', () => {
    localStorage.setItem('auth_token', 'abc123');
    localStorage.setItem('auth_expires_at', (Date.now() + 3600000).toString());
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('isAuthenticated should return false when token is expired', () => {
    localStorage.setItem('auth_token', 'abc123');
    localStorage.setItem('auth_expires_at', (Date.now() - 1000).toString());
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('isAuthenticated should return false when no token', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('logout should remove token and expiresAt from localStorage', () => {
    localStorage.setItem('auth_token', 'abc123');
    localStorage.setItem('auth_expires_at', '999999999999');
    service.logout();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_expires_at')).toBeNull();
  });

  it('getToken should return the stored token', () => {
    localStorage.setItem('auth_token', 'mytoken');
    expect(service.getToken()).toBe('mytoken');
  });

  it('register should call POST /api/auth/register', () => {
    const mockUser = { id: 1, name: 'Test', email: 'test@test.com', roles: ['USER'] };

    service.register({ name: 'Test', email: 'test@test.com', password: '123456' }).subscribe(res => {
      expect(res.id).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });
});
