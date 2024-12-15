import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService
      .signOut()
      .then(() => {
        this.router.navigate(['/auth/login']);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
