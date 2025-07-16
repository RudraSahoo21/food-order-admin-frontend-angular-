import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import { FormValidationService } from '../form-validation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  currentStatus: Boolean = false;
  receivedVariants: any[] = [];
  varientListForm: FormGroup;
  mainIndexForRemove: number = 0;
  AddonIndexForRemove: number = 0;
  DeleteModalOpenByFooter: boolean = false;
  //constructor
  constructor(
    private service: CommunicationService,
    private fb: FormBuilder,
    private formService: FormValidationService
  ) {
    this.varientListForm = this.fb.group({
      variantGroups: this.fb.array([]),
    });
  }

  //lifecycle hook
  ngOnInit(): void {
    // footer div visibility
    this.service.currentStatus$.subscribe((status) => {
      this.currentStatus = status;
    });

    // dynamic Input & value
    this.service.getCreateVariants().subscribe((data) => {
      this.receivedVariants = data; // Store the data when received
      this.addFormGroup();
    });

    //Adding validation
    this.formService.registerForm(this.varientListForm);

    // packageing Charge
    this.service.packageingCostData$.subscribe((data) => {
      // this.getpackageingCharge(data);
      this.packageingCharge = parseFloat(data) || 0;
    });
    this.variantGroups.get('packagingCharge')?.valueChanges.subscribe((val) => {
      console.log('Packaging Charge changed:', val);
      // You can react to changes here
    });
    //taxrate
    this.service.taxreteData$.subscribe((data) => {
      this.TaxRate = parseFloat(data) || 0;
      this.calculateTaxTrigger();
    });

    //addOn section visibility
    this.service.addOnSection$.subscribe((status) => {
      this.isVisiableAddon = status;
    });

    //addOn Data
    this.service.modalDataToFooter$.subscribe((data) => {
      if (data) {
        this.addAddOnToVariant(data);
      }
    });

    // Delete Variant AddOns
    this.service.deleteVariantAddons$.subscribe((status) => {
      if (status) {
        this.confirmRemoveAddOns(status);
      }
    });

    // // delete variants
    // this.service.deleteVariant$.subscribe((status) => {
    //   if (status) {
    //     this.confirmRemove(status);
    //   }
    // });
  }

  //getting array inside a form group
  get variantGroups() {
    return this.varientListForm.get('variantGroups') as FormArray;
  }
  getVariantAddOns(mainIndex: number): FormArray {
    return this.variantGroups.at(mainIndex).get('variantAddOns') as FormArray;
  }

  //createing form groups
  addFormGroup() {
    const variants = this.fb.group({
      VariantName: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      Stock: ['', [Validators.required]],
      MRP: [''],
      Price: ['', [Validators.required]],
      selectedOption: [''],
      sellingPrice: [0],
      commission: [0],
      tax: [0],
      packagingCharge: [this.packageingCharge],
      totalCost: [0],
      //AddOn Array
      variantAddOns: this.fb.array([]),
    });

    //adding dynamic fields in to the group
    if (this.receivedVariants.length > 0) {
      console.log('receivedVariants:', this.receivedVariants);
      this.receivedVariants.forEach((items) => {
        variants.addControl(
          items.name,
          this.fb.control(items.value, Validators.required)
        );
      });
      //adding the dynamic values as form name
      const variantNames = this.receivedVariants.map((item) => item.value);
      variants.get('VariantName')?.setValue(variantNames.join(' '));
      this.variantGroups.push(variants);
    }
  }
  //removeing Form Groups
  removeFormGroups(index: number) {
    this.variantGroups.removeAt(index);
  }

  // Method to get control keys (dynamic fields)
  getControlKeys(group: any): string[] {
    return Object.keys(group.controls).filter(
      (key) =>
        key !== 'VariantName' &&
        key !== 'sku' &&
        key !== 'Stock' &&
        key !== 'MRP' &&
        key !== 'Price' &&
        key !== 'selectedOption' &&
        key !== 'sellingPrice' &&
        key !== 'commission' &&
        key !== 'tax' &&
        key !== 'packagingCharge' &&
        key !== 'totalCost' &&
        key !== 'variantAddOns'
    );
  }

  //calculation
  TaxRate: number = 0; //value comes from priceing component

  // trigger the celow calculation function after change in tax rate
  calculateTaxTrigger(): void {
    this.variantGroups.controls.forEach((variantFormGroup, index) => {
      this.calculation(index); // Perform the calculation for each variant
    });
  }
  packageingCharge: number = 0; // value comes from priceing component
  calculation(index: number): void {
    const variantFormGroup = this.variantGroups.at(index);
    const sellingPrice: number =
      parseFloat(this.variantGroups.at(index).get('Price')?.value) || 0;
    const commission: number = sellingPrice * 0.12; // Assuming 12% commission
    const packagingCharge: number = this.packageingCharge;
    const tax: number = sellingPrice * (this.TaxRate / 100);
    const totalCost: number = sellingPrice + commission + tax + packagingCharge;
    //dynamically adding the values
    variantFormGroup.patchValue({
      sellingPrice,
      commission,
      tax,
      packagingCharge,
      totalCost,
    });
  }

  // functions
  // getpackageingCharge(value: any) {
  //   this.variantGroups.get('packagingCharge')?.setValue(parseFloat(value) || 0);
  // }

  // -------------------------------------------------------------AddOn Section
  isVisiableAddon: boolean = false;
  isModalOpenByFooter: boolean = false;
  data1: any;
  index: number = 0;

  addAddOnsModalOpen(index: number) {
    this.isModalOpenByFooter = true;
    this.service.modalopenByFooter(this.isModalOpenByFooter);
    this.index = index;
    console.log(index);
    console.log('data is in footer', this.data1);
  }
  addAddOnToVariant(addOnData: object) {
    if (addOnData != null) {
      const addonGroups: FormGroup = this.fb.group({
        addonCategory: [''],
        addonName: [''],
        description: [''],
        addonPrice: [''],
        taxPercentage: [],
        taxrate: [],
        type: [''],
      });
      addonGroups.patchValue(addOnData);
      const variantGroup = this.variantGroups.at(this.index); // Get the specific variant group at the provided index
      const variantAddOns = variantGroup.get('variantAddOns') as FormArray; // Get the variantAddOns array
      variantAddOns.push(addonGroups);
      console.log('variantgroup', this.varientListForm);
    }
  }

  // remove addOns
  removeAddOns(mainIndex: number, adonIndex: number) {
    this.mainIndexForRemove = mainIndex;
    this.AddonIndexForRemove = adonIndex;
    this.DeleteModalOpenByFooter = true;
    this.service.isdeleteModalOpenForProduct(this.DeleteModalOpenByFooter);
    this.DeleteModalOpenByFooter = false;
  }
  confirmRemoveAddOns(status: boolean) {
    if (status) {
      this.getVariantAddOns(this.mainIndexForRemove).removeAt(
        this.AddonIndexForRemove
      );
    }
  }
}
