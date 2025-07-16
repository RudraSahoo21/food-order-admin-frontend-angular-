import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authguardGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  if (token) {
    return true;
  } else {
    return router.createUrlTree(['/DashBoard/SignIn']);
  }
};
