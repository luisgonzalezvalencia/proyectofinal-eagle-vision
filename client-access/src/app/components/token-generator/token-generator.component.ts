import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-token-generator',
  standalone: true,
  templateUrl: './token-generator.component.html',
  imports: [AsyncPipe, NgIf],
  providers: [],
})
export class TokenGeneratorComponent {
  client$ = this.authService.currentClient$;
  isHashed = true;
  copySuccess = '';

  constructor(
    private authService: AuthService,
    private clientService: ClientService
  ) { }

  generateToken() {
    if (!this.authService.currentClient) {
      return;
    }
    this.clientService
      .generateToken(this.authService.currentClient.id)
      .subscribe(() => {
        // Actualizar el cliente después de generar el token
        this.authService.refreshCurrentClient();
      });
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
