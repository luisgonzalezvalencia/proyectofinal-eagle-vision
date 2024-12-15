import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
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
    console.log('Subscribing');
    this.authService.currentUser$
      .pipe(
        switchMap((user) => {
          console.log('Subscribing', user);
          if (!user) {
            throw new Error('No user logged in');
          }
          const uniqueId = this.generateUniqueInteger();
          const expirationDate = new Date(); // Add 30 days;
          expirationDate.setDate(expirationDate.getDate() + 30);
          return this.clientService.set({
            userId: user.uid,
            clientId: uniqueId,
            expirationDate: expirationDate.toISOString(),
          });
        })
      )
      .subscribe((data) => {
        console.log('Subscription done', data);
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

  private generateUniqueInteger(): number {
    const timestamp = Date.now(); // Obtiene el timestamp actual
    const randomComponent = Math.floor(Math.random() * 1000); // Genera un número aleatorio entre 0 y 999
    return parseInt(`${timestamp}${randomComponent}`); // Combina timestamp y número aleatorio
  }
}
