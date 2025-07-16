import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-done',
  standalone: true,
  imports: [],
  templateUrl: './done.component.html',
  styleUrl: './done.component.css',
})
export class DoneComponent implements OnInit {
  message!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigationState = history.state;
    if (navigationState && navigationState.message) {
      this.message = navigationState.message; // Set the message
    }

    setTimeout(() => {
      this.router.navigate(['/DashBoard']);
    }, 3000);
  }
}
