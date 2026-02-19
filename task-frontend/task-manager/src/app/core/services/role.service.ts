import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private authService = inject(AuthService);

  getRoles(): string[] {
    const token = this.authService.getToken();
    if (!token) return [];

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (Array.isArray(payload['roles'])) return payload['roles'];
      if (Array.isArray(payload['authorities'])) return payload['authorities'];

      if (typeof payload['scope'] === 'string') {
        return payload['scope'].split(' ').filter((s: string) => s.length > 0);
      }

      return [];
    } catch {
      return [];
    }
  }

  hasRole(role: string): boolean {
    return this.getRoles().some(r => r === role || r === `ROLE_${role}`);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN') || this.getRoles().includes('ROLE_ADMIN');
  }
}
