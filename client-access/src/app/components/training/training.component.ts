import { Component } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';
import { CheckService } from '../../services/check.service';
import { ToastService } from '../../services/toast.service';
import { NgIf } from '@angular/common';
import { HttpRequestService } from '../../services/http-request.service';

@Component({
  selector: 'app-training',
  standalone: true,
  templateUrl: './training.component.html',
  imports: [NgIf, ],
  providers: [CheckService, HttpRequestService],
})
export class TrainingComponent {
  canTrain: boolean = false;
  clientId: number | undefined;
  isTraining: boolean = false;

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private checkService: CheckService,
    private toastService: ToastService
  ) {
    this.authService.currentClient$
      .pipe(
        switchMap((client) => {
          if (!client || !client.clientId) {
            return of([]);
          }

          this.clientId = client.clientId;
          return this.clientService.getUsers(client.clientId);
        })
      )
      .subscribe((users) => {
        this.canTrain = users.length > 0;
      });
  }

  startTraining() {
    if (!this.clientId) {
      return;
    }

    this.isTraining = true;
    let data = new FormData();
    data.append('client_id', this.clientId?.toString());
    this.checkService.startTraining(data).subscribe(
      (response) => {
      this.isTraining = false;
      if(!response.error){
        this.toastService.success(
          response.message ?? 'Entrenamiento realizado.'
        );
      }else{
        this.toastService.error(response.error);
      }
    })
  }
}
