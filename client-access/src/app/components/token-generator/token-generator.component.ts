import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-token-generator',
  standalone: true,
  templateUrl: './token-generator.component.html',
  imports: [AsyncPipe, NgIf],
  providers: [],
})
export class TokenGeneratorComponent {
  client$ = this.clientService.currentClient$;
  isHashed = true;
  copySuccess = '';

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private toastService: ToastService
  ) {}

  generateToken() {
    if (!this.clientService.currentClient) {
      return;
    }

    this.clientService
      .generateToken(this.clientService.currentClient.id)
      .subscribe(() => {
        this.toastService.success('Token generado correctamente');
      });
  }

  copyToken(): void {
    if (!this.clientService.currentClient?.token) {
      return;
    }
  }

  toggleViewToken() {
    this.isHashed = !this.isHashed;
  }
}
