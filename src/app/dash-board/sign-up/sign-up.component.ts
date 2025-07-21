import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  // injects
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private route = inject(Router);

  // form
  SignupFrom!: FormGroup;

  ngOnInit(): void {
    this.SignupFrom = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /** Functions */
  // Submit
  onSubmit() {
    if (this.SignupFrom.invalid) {
      this.SignupFrom.markAllAsTouched();
      return;
    }
    const Payload = this.SignupFrom.value;
    this.api.UserSignup(Payload).subscribe({
      next: (res) => {
        console.log(res);
        alert(' SignUp Sucessfull');
        this.route.navigate(['/DashBoard/SignIn']);
      },
      error: (err) => {
        alert('SignUp Failed');
      },
    });
  }
}
