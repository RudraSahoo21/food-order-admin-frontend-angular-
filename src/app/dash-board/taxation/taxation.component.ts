import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { ToastServiceService } from '../toast/toast-service.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-taxation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './taxation.component.html',
  styleUrl: './taxation.component.css',
})
export class TaxationComponent implements OnInit {
  taxation: { id: string; TaxationName: string; TaxationRate: any }[] = []; // main array who stored the api value
  taxation_subArr: { id: string; TaxationName: string; TaxationRate: any }[] =
    []; //Sub array used for looping and searching
  message: String = '';
  taxationForm!: FormGroup;
  isLoading: boolean = false;
  editForm!: FormGroup;
  selectedItemId: string | null = null; // useing for sotoreing the Id for updation
  selectedItemForDelet!: any;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private toast: ToastServiceService
  ) {}
  ngOnInit(): void {
    // createing a form group
    this.taxationForm = this.fb.group({
      TaxationName: ['', Validators.required],
      TaxationRate: [
        0,
        [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
          Validators.min(0.01),
        ],
      ],
    });
    this.reset();
    this.editForm = this.fb.group({
      TaxationName: ['', Validators.required],
      TaxationRate: [
        0,
        [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
          Validators.min(0.01),
        ],
      ],
    });
  }

  // Add New taxes
  addNewtax() {
    if (this.taxationForm.invalid) {
      this.taxationForm.markAllAsTouched(); // To show errors if user hasn't touched fields yet
      return; // Stop submission
    }
    const formdata = {
      taxName: this.taxationForm.get('TaxationName')?.value,
      taxRate: +this.taxationForm.get('TaxationRate')?.value,
    };
    this.api.addnewTax(formdata).subscribe({
      next: (res) => {
        console.log(res);
        this.showToast(res.message, 'success');
        this.reset();
        this.formvalueReset();
      },
      error: (err) => {
        const msg =
          err.error && err.error.message
            ? err.error.message
            : 'Unknown error occurred';
        console.log('Error In delete the tax:', msg);
        this.showToast(msg, 'danger');
      },
    });
  }

  // formcontrol value reset
  formvalueReset(): void {
    this.taxationForm.reset();
  }

  // Serach button functionalities
  searchList(taxName: string, taxRate: string) {
    this.isLoading = true;
    setTimeout(() => {
      const taxrate = parseFloat(taxRate);
      console.log('taxName :-', taxName, 'Taxrate :-', taxrate);

      const hasName = taxName.trim().length > 0;
      const hasRate = !isNaN(taxrate);

      if (hasName && !hasRate) {
        // Only name provided
        const regex = new RegExp(taxName, 'i');
        this.taxation_subArr = this.taxation.filter((item) =>
          regex.test(item.TaxationName)
        );
      } else if (!hasName && hasRate) {
        // Only rate provided
        this.taxation_subArr = this.taxation.filter(
          (item) => parseFloat(item.TaxationRate) === taxrate
        );
      } else if (hasName && hasRate) {
        // Both name and rate provided
        const regex = new RegExp(taxName, 'i');
        this.taxation_subArr = this.taxation.filter(
          (item) =>
            regex.test(item.TaxationName) &&
            parseFloat(item.TaxationRate) === taxrate
        );
      } else {
        // Neither provided — reset list
        this.taxation_subArr = this.taxation;
      }
      this.currentpage = 1;
      this.isLoading = false;
    }, 500);
  }

  // Reset Button Functionalities or Reset the entire form table
  reset() {
    this.isLoading = true;
    this.api.fetchAllTaxes().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          setTimeout(() => {
            this.taxation = res.data.map((item: any) => ({
              id: item._id,
              TaxationName: item.TaxationName,
              TaxationRate: item.TaxationRate,
            }));
            this.taxation_subArr = this.taxation;
            this.currentpage = 1;
            this.isLoading = false;
          }, 2000);
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error in fatching Taxation rates:', err);
        this.isLoading = false;
      },
    });
  }

  // Edit Button
  editTaxes(item: any) {
    console.log(item);
    this.selectedItemId = item.id;
    this.editForm.patchValue({
      TaxationName: item.TaxationName,
      TaxationRate: item.TaxationRate,
    });
  }

  // send tax data to modal
  sendDeleteTaxtoModal(item: any) {
    this.selectedItemForDelet = item;
  }

  // Pagenation
  currentpage: number = 1;
  itemsPerPage: number = 2;
  getCurrentPageItems() {
    const startIndex = (this.currentpage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.taxation_subArr.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.taxation_subArr.length / this.itemsPerPage);
  }
  nextPage() {
    if (this.currentpage < this.totalPages) {
      this.currentpage++;
    }
  }
  prevPage() {
    if (this.currentpage > 1) {
      this.currentpage--;
    }
  }

  // Save upadated modal data (edit Data)
  saveEdit() {
    if (this.editForm.valid && this.selectedItemId) {
      const updatedItem = {
        id: this.selectedItemId,
        ...this.editForm.value,
      };
      this.api.editTaxes(updatedItem).subscribe({
        next: (res) => {
          console.log(res.message);
          this.closeDeleteModal();
          this.showToast(res.message, 'success');
          this.reset();
        },
        error: (err) => {
          const msg =
            err.error && err.error.message
              ? err.error.message
              : 'Unknown error occurred';
          console.log('Error In delete the tax:', msg);
          this.showToast(msg, 'danger');
        },
      });
      console.log('Updated Item:', updatedItem);
    }
  }

  // delete tax via modal
  deleteTax() {
    // console.log(typeof this.selectedItemForDelet.id);
    this.api.deleteTax(this.selectedItemForDelet.id).subscribe({
      next: (res) => {
        if (res.success) {
          console.log(res.message);
          this.closeDeleteModal();
          this.showToast(res.message, 'success');
          this.reset();
        }
      },
      error: (err) => {
        const msg =
          err.error && err.error.message
            ? err.error.message
            : 'Unknown error occurred';
        console.log('Error In delete the tax:', msg);
        this.showToast(msg, 'danger');
      },
    });
  }

  // close Delete Modal
  closeDeleteModal() {
    const closeBtn = document.querySelector(
      '.modal.show  .btn-close'
    ) as HTMLElement;
    closeBtn?.click(); // triggers the dismiss behavior
  }

  showToast(
    message: string,
    type: 'success' | 'danger' | 'info' | 'warning' = 'info'
  ) {
    this.toast.show(message, type);
  }
}
