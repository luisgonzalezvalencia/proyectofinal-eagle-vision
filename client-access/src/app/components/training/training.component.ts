import { Component } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-training',
  standalone: true,
  templateUrl: './training.component.html',
  imports: [],
  providers: [],
})
export class TrainingComponent {
  canTrain: boolean = false;
  isHashed = true;
  copySuccess = '';

  constructor(
    private authService: AuthService,
    private clientService: ClientService
  ) {
    this.authService.currentClient$
      .pipe(
        switchMap((client) => {
          if (!client || !client.clientId) {
            return of([]);
          }

          return this.clientService.getUsers(client.clientId);
        })
      )
      .subscribe((users) => {
        this.canTrain = users.length > 0;
      });
  }

  startTraining() {
    console.log('training');
  }
}
