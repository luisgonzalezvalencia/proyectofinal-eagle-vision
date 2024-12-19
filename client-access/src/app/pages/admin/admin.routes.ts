import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    ...canActivate(() => redirectUnauthorizedTo(['login'])),
  },
  {
    path: 'plans',
    loadComponent: () =>
      import('./plans/plans.component').then((m) => m.PlansComponent),
    ...canActivate(() => redirectUnauthorizedTo(['login'])),
  },
];
