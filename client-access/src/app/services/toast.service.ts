import { Injectable } from '@angular/core';

export interface Toast {
  template: string;
  classname?: string;
  delay?: number;
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(template: string, options: Partial<Toast> = {}): void {
    this.toasts.push({ template, ...options });
  }

  success(message: string, delay = 5000): void {
    this.show(message, {
      classname: 'bg-success text-white',
      delay,
      icon: 'bi-check-circle',
    });
  }

  error(message: string, delay = 5000): void {
    this.show(message, {
      classname: 'bg-danger text-white',
      delay,
      icon: 'bi-x-circle',
    });
  }

  warning(message: string, delay = 5000): void {
    this.show(message, {
      classname: 'bg-warning text-dark',
      delay,
      icon: 'bi-exclamation-triangle',
    });
  }

  info(message: string, delay = 5000): void {
    this.show(message, {
      classname: 'bg-info text-white',
      delay,
      icon: 'bi-info-circle',
    });
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
