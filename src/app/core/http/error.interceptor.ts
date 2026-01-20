import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../ui/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const message = extractErrorMessage(err);
        if (message) {
          toast.error(message);
        }
      } else {
        toast.error('Something went wrong');
      }
      return throwError(() => err);
    })
  );
};

function extractErrorMessage(err: HttpErrorResponse): string {
  if (!err) return 'Request failed';

  const body = err.error as any;
  const msg = body?.message || body?.error || body?.detail;
  if (typeof msg === 'string' && msg.trim()) return msg;

  if (err.status === 0) return 'Cannot reach server. Is backend running on :8085 ?';
  if (err.status === 401) return 'Unauthorized. Please sign in again.';
  if (err.status === 403) return 'Forbidden.';
  if (err.status >= 500) return 'Server error. Try again.';

  return `Request failed (${err.status})`;
}
