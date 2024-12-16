import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-subscribe',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.scss',
})
export class SubscribeComponent {
  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router
  ) {}

  subscribe() {
    if (!this.authService.userId) {
      return;
    }
    this.clientService
      .startSubscription(this.authService.userId)
      .subscribe((data) => {
        this.router.navigate(['/admin/home']);
      });
  }

  goBack() {
    this.authService
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
