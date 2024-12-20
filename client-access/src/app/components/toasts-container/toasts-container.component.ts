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
      [class]="getTypeClasses(toast.type)"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
      <i
        class="me-2 bi"
        *ngIf="getIcon(toast.type, toast.icon)"
        [class]="getIcon(toast.type, toast.icon)"
      ></i>
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

  getTypeClasses(type: 'success' | 'error' | 'warning' | 'info' | 'default') {
    return {
      success: 'bg-success text-light',
      error: 'bg-danger text-light',
      warning: 'bg-warning text-dark',
      info: 'bg-info text-light',
      default: 'bg-light text-dark',
    }[type];
  }

  getIcon(
    type: 'success' | 'error' | 'warning' | 'info' | 'default',
    customIcon?: string
  ) {
    return (
      customIcon ||
      {
        success: 'bi-check-circle-fill',
        error: 'bi-x-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill',
        default: 'bi-info-circle-fill',
      }[type]
    );
  }
}
