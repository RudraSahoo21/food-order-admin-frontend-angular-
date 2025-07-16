import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidationService } from '../../form-validation.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  constructor(private formService: FormValidationService) {
    this.inventoryForm_validation = new FormGroup({
      Allow_Order: new FormControl(false),
      sku: new FormControl('', [Validators.required]),
      Available_Stock: new FormControl(0, [Validators.required]),
      Barcode_No: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.formService.registerForm(this.inventoryForm_validation);
  }

  inventoryForm_validation!: FormGroup;
}
