import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const url = req.url;
  const isApi = url.includes('/api/');
  const isAdminApi = url.includes('/api/admin/');
  const isAuthApi = url.includes('/api/auth/');

  let token: string | null = null;

  if (isApi && !isAuthApi) {
    if (isAdminApi) {
      token = auth.getAdminToken();
    } else {
      token = auth.getUser()?.token ?? null;
    }
  }

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};
