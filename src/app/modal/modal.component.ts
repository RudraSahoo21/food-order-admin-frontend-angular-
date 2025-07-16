import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../api.service';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit {
  addonForm!: FormGroup;
  isModalOpen: boolean = false; // Track modal visibility
  isFooterAddonChecked: boolean = false; // footer addon checking
  isformSubmitted: boolean = false;
  isDeleteModalOpen: boolean = false; // Delete Modal
  filteredList: any[] = [];
  showSuggestions: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: CommunicationService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    // Initialize form group with validation
    this.addonForm = this.fb.group({
      addonCategory: ['', Validators.required],
      addonName: ['', Validators.required],
      addonPrice: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Ensure only numbers
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
      taxPercentage: [],
      taxrate: [],
    });
    this.service.modalOpenInBody$.subscribe((status) => {
      this.isModalOpen = status;
    });
    this.service.isFooterAddonChecked$.subscribe((status) => {
      this.isFooterAddonChecked = status;
    });
    this.service.isModalOpenByFooter$.subscribe((status) => {
      this.isModalOpen = status;
    });

    // Delete
    this.service.deleteModalOpenForProduct$.subscribe((status) => {
      this.isDeleteModalOpen = status;
    });
  }
  // changed filtered list
  SearchedList() {
    const catagory = this.addonForm.get('addonCategory')?.value;
    const name = this.addonForm.get('addonName')?.value;
    this.api.searchAddonList(catagory, name).subscribe({
      next: async (response) => {
        this.filteredList = await response.data;
        this.showSuggestions = true; // show dropdown
      },
      error: (err) => {
        console.error('Error fetching search results:', err);
      },
    });
  }

  // selecting addons form dropdown
  selectAddon(
    name: string,
    price: number,
    precentage: number,
    desc: string,
    type: string
  ) {
    this.addonForm.get('addonName')?.setValue(name);
    this.addonForm.get('addonPrice')?.setValue(price);
    this.addonForm.get('taxPercentage')?.setValue(precentage);
    const taxRate = price * (precentage / 100);
    this.addonForm.get('taxrate')?.setValue(taxRate);
    this.addonForm.get('description')?.setValue(desc);
    this.addonForm.get('type')?.setValue(type);
    this.showSuggestions = false; // Hide suggestions after selection
  }
  // reset the form when catagory value change
  formReset() {
    this.filteredList = [];
    this.addonForm.get('addonName')?.reset();
  }

  //tax calculation if user want to change
  taxRate() {
    const taxPercentage: number = this.addonForm.get('taxPercentage')?.value;
    const addonPrice: number = this.addonForm.get('addonPrice')?.value;
    const taxrate = addonPrice * (taxPercentage / 100);
    this.addonForm.get('taxrate')?.setValue(taxrate);
    this.addonForm.get('taxPercentage')?.setValue(taxPercentage);
  }

  // Close modal
  closeModal() {
    this.isModalOpen = false;
    this.addonForm.reset();
    this.isDeleteModalOpen = false;
  }

  // Handle form submission
  isModalOpenByFooter: boolean = false;
  onSubmit() {
    if (this.addonForm.invalid) {
      this.isformSubmitted = true;
      this.addonForm.markAllAsTouched(); // Mark all fields as touched if the form is invalid
      return;
    }

    if (this.addonForm.valid) {
      if (!this.isFooterAddonChecked) {
        console.log('data is going towords Body addons');
        console.log(this.addonForm.value);
        this.service.setModalFormData(this.addonForm.value);
        this.closeModal(); //  close the modal after submission
      }
      if (this.isFooterAddonChecked) {
        console.log('data is going towords footer addons');
        console.log(this.addonForm);
        this.service.setmodalDataToFooter(this.addonForm.value);
        this.closeModal(); //  close the modal after submission
      }
    }
  }

  OnRemove() {
    let deleteConfirmed: boolean = true;
    if (!this.isFooterAddonChecked) {
      this.service.isdeleteProductAddons(deleteConfirmed);
      this.closeModal();
      deleteConfirmed = false;
    } else if (this.isFooterAddonChecked) {
      this.service.isdeleteVariantAddons(deleteConfirmed);
      this.closeModal();
      deleteConfirmed = false;
    }
  }
}
