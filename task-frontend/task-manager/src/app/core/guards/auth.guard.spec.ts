import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow access when authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/tasks' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBeTrue();
  });

  it('should block access and navigate to /auth/login when not authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/tasks' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login'], { queryParams: { returnUrl: '/tasks' } });
  });
});
