import { Injectable } from '@angular/core';

export interface Toast {
  template: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'default';
  loading?: boolean;
  delay?: number;
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(template: string, options: Partial<Toast> = {}): Toast {
    const toast = { template, ...options, type: options.type || 'default' };
    this.toasts.push(toast);
    return toast;
  }

  success(message: string, delay = 5000, icon?: string): Toast {
    return this.show(message, {
      type: 'success',
      delay,
      icon,
    });
  }

  error(message: string, delay = 5000, icon?: string): Toast {
    return this.show(message, {
      type: 'error',
      delay,
      icon,
    });
  }

  warning(message: string, delay = 5000, icon?: string): Toast {
    return this.show(message, {
      type: 'warning',
      delay,
      icon,
    });
  }

  info(message: string, delay = 5000, icon?: string): Toast {
    return this.show(message, {
      type: 'info',
      delay,
      icon,
    });
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
