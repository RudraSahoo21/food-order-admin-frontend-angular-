import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../api.service';
import { AuthenticationService } from '../../authentication.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.value;
    this.api.UserLogin(email, password).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        this.authService.setUser(res.user);
        alert('Login successful!');
        this.router.navigate(['/DashBoard/productsTable']);

        // redirect or other logic here
      },
      error: (err) => {
        alert('Login failed');
      },
    });
  }
}
