import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastServiceService {
  toasts: { message: string; type: string }[] = [];

  show(
    message: string,
    type: 'success' | 'danger' | 'info' | 'warning' = 'info'
  ) {
    const toast = { message, type };
    this.toasts.push(toast);

    // Auto dismiss
    setTimeout(() => this.remove(toast), 3000);
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
