import { Component } from '@angular/core';
import { SideBarComponent } from './side-bar/side-bar.component';
import {
  RouterOutlet,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { ToastComponent } from './toast/toast.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [
    SideBarComponent,
    RouterOutlet,
    ToastComponent,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css',
})
export class DashBoardComponent {
  showCards = false;
  sidebar = false;
  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects.replace(/\/$/, '');
        this.showCards = url === '/DashBoard';
        this.sidebar = url !== '/DashBoard';
      });
  }
}
