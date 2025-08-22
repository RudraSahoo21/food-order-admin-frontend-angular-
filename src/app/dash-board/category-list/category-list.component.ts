import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ToastServiceService } from '../toast/toast-service.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  combineListMainArray: {
    id: string;
    catindex: number;
    catName: string;
    subcategories: { _id: string; subcatIndex: number; subcatName: string }[];
  }[] = [];
  combineListSubArray: {
    id: string;
    catindex: number;
    catName: string;
    subcategories: { _id: string; subcatIndex: number; subcatName: string }[];
  }[] = [];
  isLoading: boolean = false;
  constructor(
    private api: ApiService,
    private toast: ToastServiceService,
    private fb: FormBuilder
  ) {
    // Add New Form
    this.addNewForm = this.fb.group({
      CatagoryName: ['', Validators.required],
      SubcatagoryName: this.fb.array([]), // this is the FormArray
    });
    // edit/update form
    this.updatedForm = this.fb.group({
      id: ['', Validators.required],
      CatagoryName: ['', Validators.required],
      SubcatagoryName: this.fb.array([]), // this is the FormArray
    });
  }

  ngOnInit(): void {
    this.reset();
  }
  // reset
  reset() {
    this.isLoading = true;
    this.api.fetchCombinedCatSubcat().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          setTimeout(() => {
            this.combineListMainArray = res.data.map((item: any) => ({
              id: item._id,
              catindex: item.index,
              catName: item.name,
              subcategories: item.subcategories.map((sub: any) => ({
                _id: sub._id,
                subcatIndex: sub.index,
                subcatName: sub.name,
              })),
            }));
            this.combineListSubArray = this.combineListMainArray;
            this.currentpage = 1;
            this.isLoading = false;
          }, 2000);
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  // Serach catagory and sub catagory via name
  searchCombinedInputs(cat: string, subcat: string): void {
    this.isLoading = true;
    setTimeout(() => {
      const catText = cat.trim().toLowerCase();
      const subText = subcat.trim().toLowerCase();
      if (!catText && !subText) {
        this.combineListSubArray = [...this.combineListMainArray]; // Show all if both empty
      } else {
        this.combineListSubArray = this.combineListMainArray
          .map((item) => {
            const catMatch = catText
              ? item.catName.toLowerCase().includes(catText)
              : true;
            let filteredSubcats = item.subcategories;
            if (subText) {
              filteredSubcats = item.subcategories.filter((sub) =>
                sub.subcatName.toLowerCase().includes(subText)
              );
            }
            // If category AND subcategory must match when both inputs are filled
            const condition =
              (catText && subText && catMatch && filteredSubcats.length > 0) ||
              (!catText && subText && filteredSubcats.length > 0) ||
              (catText && !subText && catMatch);
            if (condition) {
              return {
                ...item,
                subcategories: filteredSubcats,
              };
            }
            return null;
          })
          .filter((item) => item !== null); // remove nulls
      }
      this.currentpage = 1;
      this.isLoading = false;
    }, 500);
  }

  // Pagenation
  currentpage: number = 1;
  itemsPerPage: number = 2;
  getCurrentPageItems() {
    const startIndex = (this.currentpage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.combineListSubArray.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.combineListSubArray.length / this.itemsPerPage);
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

  /*.....................Modals functionalities......................*/

  /*            Add New catagory and subcatagory by modal            */
  addNewForm!: FormGroup;
  // Getter to access of SubcatagoryName FormArray
  get subCatArr(): FormArray {
    return this.addNewForm.get('SubcatagoryName') as FormArray;
  }
  // add new form control
  addNewControl() {
    this.subCatArr.push(this.fb.control('', Validators.required));
  }
  // remove unwanted subcatagory
  removeItem(index: number) {
    this.subCatArr.removeAt(index);
  }

  // after submit the form form will reset
  resetForm() {
    this.addNewForm.reset();
    const formArray = this.subCatArr;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  addFormSubmit() {
    if (this.addNewForm.valid) {
      console.log('Form Data:', this.addNewForm.value);
      this.api.addCatagorySubcatagory(this.addNewForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.reset();
        },
        error: (err) => {
          console.log('unable to load the new catagory and subcatagory', err);
        },
      });
      this.resetForm();
    } else {
      this.addNewForm.markAllAsTouched(); // shows validation errors
    }
  }

  /*            Edit catagory and subcatagory by modal            */
  updatedForm!: FormGroup;
  get subCatArrUpdate(): FormArray {
    return this.updatedForm.get('SubcatagoryName') as FormArray;
  }
  // add new form control
  addNewControlUpdate() {
    this.subCatArrUpdate.push(this.fb.control('', Validators.required));
  }
  // sending edit data to modal
  sendEditData(item: any) {
    console.log('item :', item);
    const subcatagory = item.subcategories;
    const formarray = this.updatedForm.get('SubcatagoryName') as FormArray;
    this.updatedForm.patchValue({
      id: item.id,
      CatagoryName: item.catName,
    });
    subcatagory.forEach((element: any) => {
      formarray.push(
        this.fb.control({
          subcatName: element.subcatName,
          _id: element._id,
        })
      );
    });

    console.log(this.updatedForm.value);
  }
}
