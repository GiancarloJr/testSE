import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { I18nService } from '../../shared/i18n/i18n.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const authService = inject(AuthService);
  const i18n = inject(I18nService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.logout();
      } else if (error.status === 0) {
        snackBar.open(i18n.t('errors.serverUnavailable'), i18n.t('common.close'), { duration: 5000 });
      }
      return throwError(() => error);
    })
  );
};
