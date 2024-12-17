import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'subscribe',
    loadComponent: () =>
      import('./subscribe/subscribe.component').then(
        (m) => m.SubscribeComponent
      ),
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./payment/payment.component').then((m) => m.PaymentComponent),
  },
];
