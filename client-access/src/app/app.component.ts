import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { isPast, parseISO } from 'date-fns';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'facedetection';
  isInitialized = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isInitialized$.subscribe((initialized) => {
      this.isInitialized = initialized;

      if (initialized) {
        // Una vez inicializado, maneja el flujo del usuario
        this.authService.currentUser$.subscribe((user) => {
          if (!user) {
            this.router.navigate(['/auth/login']);
          } else {
            this.authService.currentClient$.subscribe((client) => {
              if (!client || !client.expirationDate) {
                this.router.navigate(['/auth/subscribe']);
              } else if (isPast(parseISO(client.expirationDate))) {
                this.router.navigate(['/auth/payment']);
              } else {
                const cleanedUrl = [
                  '/auth/login',
                  '/auth/register',
                  '/auth/subscribe',
                ].some((url) => this.router.url.startsWith(url))
                  ? '/admin/home'
                  : this.router.url;
                this.router.navigate([cleanedUrl]);
              }
            });
          }
        });
      }
    });
  }
}
