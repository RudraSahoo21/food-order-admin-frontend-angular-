import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidationService } from '../../form-validation.service';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-categorization',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './categorization.component.html',
  styleUrl: './categorization.component.css',
})
export class CategorizationComponent implements OnInit {
  categorizationForm: FormGroup;
  catagories: { Category_id: any; id: number; name: string }[] = [];
  sub_catagories: {
    SubCategory_id: any;
    Category_id: any;
    id: number;
    name: string;
  }[] = [];
  filteredSubCategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private formService: FormValidationService,
    private api: ApiService
  ) {
    this.categorizationForm = this.fb.group({
      selectedCatagory: [null, Validators.required], // Default value for selected category
      selectedSubCatagory: [null, Validators.required], // Default value for selected sub-category
    });
    this.categorizationForm
      .get('selectedCatagory')
      ?.valueChanges.subscribe((categoryId) => {
        this.updateSubCategories(categoryId);
      });
  }

  ngOnInit(): void {
    // fetching category list form server via API
    this.api.fetchAllCategoryList().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          this.catagories = res.data.map((item: any) => ({
            Category_id: item._id,
            id: item.index,
            name: item.name,
          }));

          // console.log('the catagory is', this.catagories);
        }
      },
      error: (err) => {
        console.error('Error fetching CategoryList:', err);
      },
    });
    // fetching Subcategory list form server via API
    this.api.fetchAllSubCategoryList().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          this.sub_catagories = res.data.map((item: any) => ({
            SubCategory_id: item._id,
            Category_id: item.CategoryId,
            id: item.index,
            name: item.name,
          }));
          // console.log('the Subcatagory is', this.sub_catagories);
        }
      },
      error: (err) => {
        console.error('Error fetching in SubCategoryList:', err);
      },
    });

    this.formService.registerForm(this.categorizationForm);
  }

  // Method to update sub-categories based on selected category
  updateSubCategories(categoryId: any): void {
    const filtered = this.sub_catagories.filter(
      (sub) => sub.Category_id === categoryId
    );
    this.filteredSubCategories = filtered;
  }
}
