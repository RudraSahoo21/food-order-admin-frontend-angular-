import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../communication.service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { FormValidationService } from '../../form-validation.service';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css',
})
export class PricingComponent implements OnInit {
  tax_rate: { id: string; text: string; value: number }[] = [];

  priceingForm: FormGroup;

  constructor(
    private service: CommunicationService,
    private formService: FormValidationService,
    private api: ApiService
  ) {
    this.priceingForm = new FormGroup({
      sellingPrice: new FormControl('', [Validators.required]),
      mrp: new FormControl(''),
      packageingCharge: new FormControl('', [Validators.required]),
      purchaseCost: new FormControl(''),
      tax: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.formService.registerForm(this.priceingForm);
    this.fetchTaxList(); //fetching the tax dropdown list

    // Listen to key fields and trigger valuechange() automatically
    this.priceingForm.get('sellingPrice')?.valueChanges.subscribe(() => {
      this.valuechange();
    });

    this.priceingForm.get('tax')?.valueChanges.subscribe(() => {
      this.taxrate = parseFloat(this.priceingForm.get('tax')?.value || '0');
      this.valuechange();
    });

    this.priceingForm.get('packageingCharge')?.valueChanges.subscribe(() => {
      this.valuechange();
    });
  }

  //variables for calculation
  sellingprice: number = 0;
  commission: number = 0;
  final_tax_rate: number = 0;
  packCharge: number = 0;
  customerPrice: number = 0;

  //method for calculation
  valuechange() {
    const selectedTax = this.priceingForm.get('tax')?.value;

    this.sellingprice = parseFloat(
      this.priceingForm.get('sellingPrice')?.value || '0'
    );
    this.commission = this.sellingprice * (12 / 100);
    this.taxrate = selectedTax?.value || 0;
    this.final_tax_rate = this.sellingprice * (this.taxrate / 100);
    this.packCharge = parseFloat(
      this.priceingForm.value.packageingCharge || '0'
    );
    this.customerPrice =
      this.sellingprice +
      this.commission +
      this.final_tax_rate +
      this.packCharge;

    this.service.updatePackageingCost(this.packCharge);
  }

  taxrate: number = 0; //tax rate from tax_rate array

  //  -----------------sending data (taxrate and packageing cost) to footer component
  updateInFooter() {
    this.service.updateTaxrate(this.taxrate); // sending taxrate
  }

  // fetch Tax Dropdown List Form server
  fetchTaxList() {
    this.api.fetchAllTaxes().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          this.tax_rate = res.data.map((item: any) => ({
            id: item._id,
            text: item.TaxationName,
            value: item.TaxationRate,
          }));
        }
      },
      error: (err) => {
        console.log('Unable to fetch the taxation list:', err.message);
      },
    });
  }
}
