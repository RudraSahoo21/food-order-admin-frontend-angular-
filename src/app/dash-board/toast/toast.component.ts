import { Component } from '@angular/core';
import { ToastServiceService } from './toast-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  constructor(public toastService: ToastServiceService) {}
  remove(toast: any) {
    this.toastService.remove(toast);
  }
}
