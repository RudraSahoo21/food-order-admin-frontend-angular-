import { Component, Output, EventEmitter, output, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { CommunicationService } from '../../communication.service';
import { FormValidationService } from '../../form-validation.service';

@Component({
  selector: 'app-product-options',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './product-options.component.html',
  styleUrl: './product-options.component.css',
})
export class ProductOptionsComponent implements OnInit {
  @Output() ischeckedVeriants = new EventEmitter<boolean>();
  @Output() ischeckedAddOns = new EventEmitter<boolean>();

  isFooterAddonChecked: boolean = false;
  productOptionsForm: FormGroup; // Declare the form group

  constructor(
    private Service: CommunicationService,
    private fb: FormBuilder,
    private formService: FormValidationService
  ) {
    this.productOptionsForm = this.fb.group({
      product_has_variants: [false],
      product_has_addOns: [false],
    });
  }

  ngOnInit(): void {
    this.productOptionsForm
      .get('product_has_variants')
      ?.valueChanges.subscribe((value) => {
        this.ischeckedVeriants.emit(value);
        this.footerVisible();
        this.updateFooterAddonStatus(value);
      });

    this.productOptionsForm
      .get('product_has_addOns')
      ?.valueChanges.subscribe((value) => {
        this.ischeckedAddOns.emit(value);
      });
    this.formService.registerForm(this.productOptionsForm);
  }

  checkedVeriants(event: Event) {
    this.productOptionsForm
      .get('product_has_variants')
      ?.setValue((event.target as HTMLInputElement).checked);
  }
  checkedAddOns(event: Event) {
    this.productOptionsForm
      .get('product_has_addOns')
      ?.setValue((event.target as HTMLInputElement).checked);
  }
  // ----------------------------------------functions
  private updateFooterAddonStatus(checked: boolean): void {
    this.isFooterAddonChecked = checked;
    this.Service.footerAddonChecked(checked);
  }

  //------------------------------------------------AddonSection toggle in footer
  isVisibleAddon: boolean = false;
  toggleFooterAddOn(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.isVisibleAddon = checked;
    this.Service.toggleAddonSection(this.isVisibleAddon);
  }

  // footer visibility
  footerVisible() {
    const isVisibleFooter = this.productOptionsForm.get(
      'product_has_variants'
    )?.value;
    this.Service.updateStatus(isVisibleFooter);
  }
}
