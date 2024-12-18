import { Component, inject } from '@angular/core';

import { NgIf } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToastModule, NgIf],
  template: `
    @for (toast of toastService.toasts; track toast) {
    <ngb-toast
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
      <i class="me-2 bi" *ngIf="toast.icon" [class]="toast.icon"></i>
      {{ toast.template }}
    </ngb-toast>
    }
  `,
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 1200',
  },
})
export class ToastsContainerComponent {
  toastService = inject(ToastService);
}
