import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [AsyncPipe, NgIf],
  providers: [AuthService],
})
export class HomeComponent {
  client$ = this.authService.currentClient$;
  isHashed = true;
  copySuccess = '';

  constructor(
    private authService: AuthService,
    private clientService: ClientService
  ) {}

  generateToken() {
    if (!this.authService.currentClient) {
      return;
    }
    this.clientService
      .generateToken(this.authService.currentClient.id)
      .subscribe();
  }

  copyToken(): void {
    if (!this.authService.currentClient?.token) {
      return;
    }

    navigator.clipboard
      .writeText(this.authService.currentClient.token)
      .then(() => {
        this.copySuccess = '¡Copiado!';
        setTimeout(() => (this.copySuccess = ''), 2000);
      })
      .catch((err) => {
        console.error('Error al copiar al portapapeles:', err);
      });
  }

  toggleViewToken() {
    this.isHashed = !this.isHashed;
  }
}
