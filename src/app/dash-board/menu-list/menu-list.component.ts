import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastServiceService } from '../toast/toast-service.service';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.css',
})
export class MenuListComponent implements OnInit {
  menu_label: { id: number; name: string; label_id: any }[] = []; // main array who stored the api value
  menu_label_subArr: { id: number; name: string; label_id: any }[] = []; //Sub array used for looping and searching
  message: String = '';
  selectedItemId: string | null = null; // useing for sotoreing the Id for updation
  isLoading = false;
  MenuForm!: FormGroup;
  editForm!: FormGroup;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private toast: ToastServiceService
  ) {}
  ngOnInit(): void {
    this.MenuForm = this.fb.group({
      MenuLabelName: ['', Validators.required],
    });
    this.reset();
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      label: ['', Validators.required],
    });
  }

  // Add New MenuList
  addNewmenuList() {
    if (this.MenuForm.invalid) {
      this.MenuForm.markAllAsTouched();
      return;
    }
    const newMenuLabel = this.MenuForm.get('MenuLabelName')?.value;
    // console.log(newMenuLabel);
    this.api.addnewMenu(newMenuLabel).subscribe({
      next: (res) => {
        this.reset();
        this.showToast(res.message, 'success');
        this.MenuForm.reset();
      },
      error: (err) => {
        console.error('Error While Adding New tax', err);
        this.showToast('Failed to add new Menu Label', 'danger');
      },
    });
  }

  // Serach button functionalities
  searchList(name: string) {
    this.isLoading = true;
    setTimeout(() => {
      const regex = new RegExp(name, 'i');
      this.menu_label_subArr = this.menu_label.filter((item) =>
        regex.test(item.name)
      );
      this.currentpage = 1;
      this.isLoading = false;
    }, 500);
  }

  // Reset Button Functionalities
  reset() {
    this.isLoading = true;
    this.api.fetchAllMenuLabels().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          setTimeout(() => {
            this.menu_label = res.data.map((item: any) => ({
              label_id: item._id,
              id: item.index, // or item.id
              name: item.label, // display name
            }));
            this.menu_label_subArr = this.menu_label;
            this.currentpage = 1;
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

  // showing toast
  showToast(
    message: string,
    type: 'success' | 'danger' | 'info' | 'warning' = 'info'
  ) {
    this.toast.show(message, type);
  }

  // Pagenation
  currentpage: number = 1;
  itemsPerPage: number = 3;
  getCurrentPageItems() {
    const startIndex = (this.currentpage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.menu_label_subArr.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.menu_label_subArr.length / this.itemsPerPage);
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

  // close Modal
  closeModal() {
    const closeBtn = document.querySelector(
      '.modal.show  .btn-close'
    ) as HTMLElement;
    closeBtn?.click(); // triggers the dismiss behavior
  }

  // Edit Button functionalities
  editTaxes(item: any) {
    console.log(item);
    this.selectedItemId = item.label_id;
    this.editForm.patchValue({
      id: item.label_id,
      label: item.name,
    });
  }

  saveEdit() {
    if (this.editForm.valid) {
      const updatedItem = {
        ...this.editForm.value,
      };
      this.api.editMenuLabelName(updatedItem).subscribe({
        next: (res) => {
          console.log(res.message);
          this.closeModal();
          this.showToast(res.message, res.status);
          this.reset();
        },
        error: (err) => {
          const msg =
            err.error && err.error.message
              ? err.error.message
              : 'Unknown error occurred';
          console.log('Error In delete the Menu List:', msg);
          this.showToast(msg, 'danger');
        },
      });
    }
  }

  // Delete Button Functionalities
  selectedItemForDelet: { id: number; name: string; label_id: string } = {
    id: 0,
    name: '',
    label_id: '',
  };
  sendDeleteMenutoModal(item: any) {
    this.selectedItemForDelet = item;
    console.log(this.selectedItemForDelet);
  }
  deleteMenuItem() {
    this.api.removeMenuLabel(this.selectedItemForDelet.label_id).subscribe({
      next: (res) => {
        if (res.success) {
          console.log(res.message);
          this.closeModal();
          this.showToast(res.message, 'success');
          this.reset();
        }
      },
      error: (err) => {
        const msg =
          err.error && err.error.message
            ? err.error.message
            : 'Unknown error occurred';
        console.log('Error In delete the Menu List:', msg);
        this.showToast(msg, 'danger');
      },
    });
  }
}
