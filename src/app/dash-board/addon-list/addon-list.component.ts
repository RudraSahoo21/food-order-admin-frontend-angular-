import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validator,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../api.service';
import { ToastServiceService } from '../toast/toast-service.service';

@Component({
  selector: 'app-addon-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addon-list.component.html',
  styleUrl: './addon-list.component.css',
})
export class AddonListComponent implements OnInit {
  AddonFrom!: FormGroup;
  editForm!: FormGroup;
  addOnList_MainArr: {
    _id: string;
    catagory: string;
    name: string;
    description: string;
    type: string;
    price: number;
    tax: number;
  }[] = [];
  addOnList_SubArr: {
    _id: string;
    catagory: string;
    name: string;
    description: string;
    type: string;
    price: number;
    tax: number;
  }[] = [];
  isLoading = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private toast: ToastServiceService
  ) {}

  ngOnInit(): void {
    this.AddonFrom = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      catagory: ['', Validators.required],
      type: ['None', Validators.required],
      price: [0],
      tax: [0],
    });
    this.reset();
    this.editForm = this.fb.group({
      _id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      catagory: ['', Validators.required],
      type: ['None', Validators.required],
      price: [0],
      tax: [0],
    });
  }

  // reset button functionalites
  reset() {
    this.isLoading = true;
    this.api.fetchAllAddons().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          setTimeout(() => {
            this.addOnList_MainArr = res.data.map((item: any) => ({
              _id: item._id,
              catagory: item.catagory,
              name: item.name,
              description: item.description,
              type: item.type,
              price: item.price,
              tax: item.tax,
            }));
            this.addOnList_SubArr = this.addOnList_MainArr;
            this.isLoading = false;
          }, 2000);
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching menu labels:', err);
        this.isLoading = false;
      },
    });
  }

  //search button functionalities
  searchList(name: string) {
    this.isLoading = true;
    setTimeout(() => {
      const regex = new RegExp(name, 'i');
      this.addOnList_SubArr = this.addOnList_MainArr.filter((item) =>
        regex.test(item.name)
      );
      this.currentpage = 1;
      this.isLoading = false;
    }, 200);
  }

  // showing toast
  showToast(
    message: string,
    type: 'success' | 'danger' | 'info' | 'warning' = 'info'
  ) {
    this.toast.show(message, type);
  }

  // modal closeing trigger
  closeModal() {
    const closeBtn = document.querySelector(
      '.modal.show  .btn-close'
    ) as HTMLElement;
    closeBtn?.click(); // triggers the dismiss behavior
  }

  currentpage: number = 1;
  itemsPerPage: number = 3;
  getCurrentPageItems() {
    const startIndex = (this.currentpage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.addOnList_SubArr.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.addOnList_SubArr.length / this.itemsPerPage);
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

  // Form Submit Functions (add button modal form submit)
  addAddons() {
    if (this.AddonFrom.invalid) {
      this.AddonFrom.markAllAsTouched();
      return;
    }
    const payload = this.AddonFrom.value;
    this.api.addAddons(payload).subscribe({
      next: (res) => {
        console.log(res);
        this.reset();
        this.showToast(res.message, res.status);
        this.AddonFrom.reset();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error While Adding New tax', err);
        this.showToast('Unable to add the new addon', 'danger');
      },
    });
  }

  /*  Edit button functionalities  */

  // data send form table to edit modal
  senddatatomodal(items: any) {
    this.editForm.patchValue({
      ...items,
    });
  }
  // update the data in db via Api
  saveEdit() {
    if (this.editForm.valid) {
      const payload = {
        ...this.editForm.value,
      };
      this.api.updateAddons(payload).subscribe({
        next: (res) => {
          console.log(res.message);
          this.closeModal();
          this.showToast(res.message, res.status);
          this.reset();
        },
        error: (err) => {
          console.log('Unable to update the updated name', err.message);
          const msg =
            err.error && err.error.message
              ? err.error.message
              : 'Unknown error occurred';
          console.log('Error In delete the qaddonlist:', msg);
          this.showToast(msg, 'danger');
        },
      });
    }
  }

  /*  Delete button functionalities  */
  sendToDtlModalObj?: {
    catagory: string;
    description: string;
    name: string;
    price: number;
    tax: number;
    type: string;
    _id: string;
  };
  sendDataToDeletModal(items: any) {
    this.sendToDtlModalObj = items;
  }
  deleteaddon() {
    if (!this.sendToDtlModalObj?._id) {
      console.warn('No addon ID to delete.');
      return;
    }
    this.api.deleteAddon(this.sendToDtlModalObj._id).subscribe({
      next: (res) => {
        if (res.success) {
          console.log(res.message);
          this.closeModal();
          this.showToast(res.message, res.state);
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
}
