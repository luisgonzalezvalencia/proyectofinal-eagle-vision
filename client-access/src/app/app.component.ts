import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ClientService } from './services/client.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'facedetection';

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.clientService.get(user.uid).subscribe((client) => {
          console.log('AppComponent client:', client, user);
          if (!client) {
            this.router.navigate(['/auth/subscribe']);
          }
        });
      }
    });
  }
}
