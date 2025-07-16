import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommunicationService } from '../../communication.service';
import { FormValidationService } from '../../form-validation.service';

@Component({
  selector: 'app-basic-information',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './basic-information.component.html',
  styleUrl: './basic-information.component.css',
})
export class BasicInformationComponent implements OnInit {
  constructor(
    private service: CommunicationService,
    private formService: FormValidationService
  ) {
    // reactive form validation
    this.basicInfo_validation = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      shortDescription: new FormControl('', [Validators.required]),
      productStatus: new FormControl(false),
    });
  }
  ngOnInit(): void {
    this.formService.registerForm(this.basicInfo_validation); // pushed this formgroup into the servicefile main formgroup array
    this.basicInfo_validation
      .get('productStatus')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.isActive = value;
        }
      });
  }

  basicInfo_validation: FormGroup;
  isActive: Boolean = false;
  statusChange(event: Event): void {
    this.isActive = (event.target as HTMLInputElement).checked;
  }
}
