import { Component, OnInit } from '@angular/core';
import { BasicInformationComponent } from './basic-information/basic-information.component';
import { InventoryComponent } from './inventory/inventory.component';
import { CategorizationComponent } from './categorization/categorization.component';
import { ImagesComponent } from './images/images.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { ProductWeightComponent } from './product-weight/product-weight.component';
import { MenuConfigurationComponent } from './menu-configuration/menu-configuration.component';
import { PricingComponent } from './pricing/pricing.component';
import { SearchConfigurationComponent } from './search-configuration/search-configuration.component';
import { ScheduledOrderConfigurationComponent } from './scheduled-order-configuration/scheduled-order-configuration.component';
import { ProductOptionsComponent } from './product-options/product-options.component';
import { ManageVariantsComponent } from './manage-variants/manage-variants.component';
import { AddonsComponent } from './addons/addons.component';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { FormValidationService } from '../form-validation.service';
@Component({
  selector: 'app-body',
  standalone: true,
  imports: [
    CommonModule,
    BasicInformationComponent,
    InventoryComponent,
    CategorizationComponent,
    ImagesComponent,
    ProductTypeComponent,
    ProductWeightComponent,
    MenuConfigurationComponent,
    PricingComponent,
    SearchConfigurationComponent,
    ScheduledOrderConfigurationComponent,
    ProductOptionsComponent,
    ManageVariantsComponent,
    AddonsComponent,
  ],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css',
})
export class BodyComponent implements OnInit {
  isVeriantChecked: boolean = false;
  isAddonChecked: boolean = false;

  constructor(
    private location: Location,
    private formService: FormValidationService
  ) {}

  ngOnInit(): void {
    const state = this.location.getState() as { productDetails?: any };
    // Check if state exists and if productDetails is present and not empty
    if (
      state &&
      state.productDetails &&
      Object.keys(state.productDetails).length > 0
    ) {
      // If conditions are met, populate the forms with the product details
      this.formService.populateFormsWithData(state.productDetails);
    } else {
      // Optionally, log or handle the case where productDetails is empty or missing
      console.log('No product details found or product details are empty.');
    }
  }
}
