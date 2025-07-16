import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { FormValidationService } from '../../form-validation.service';

@Component({
  selector: 'app-product-weight',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-weight.component.html',
  styleUrl: './product-weight.component.css',
})
export class ProductWeightComponent implements OnInit {
  weightForm_validation: FormGroup;

  constructor(private formService: FormValidationService) {
    this.weightForm_validation = new FormGroup({
      product_weight: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.formService.registerForm(this.weightForm_validation);
  }
}
