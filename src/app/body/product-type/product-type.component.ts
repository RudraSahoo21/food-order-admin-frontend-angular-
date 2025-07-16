import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FormValidationService } from '../../form-validation.service';

@Component({
  selector: 'app-product-type',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-type.component.html',
  styleUrl: './product-type.component.css',
})
export class ProductTypeComponent {
  productTypeForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private formService: FormValidationService
  ) {
    this.productTypeForm = this.fb.group({
      productType: ['None'],
    });

    this.formService.registerForm(this.productTypeForm);
  }
}
