import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnInit {
  LocalStorageToken: string = '';
  UserRole: string = '';

  private authService = inject(AuthenticationService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.token$.subscribe((token) => {
      this.LocalStorageToken = token;
    });
    this.authService.user$.subscribe((user) => {
      this.UserRole = user;
    });
  }

  // SignOff modal things are here
  logout() {
    this.authService.clearToken();
    this.LocalStorageToken = '';
    this.router.navigate(['/DashBoard/SignIn']);
  }
}
