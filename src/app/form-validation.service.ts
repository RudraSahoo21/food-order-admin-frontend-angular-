import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LoaderService } from './Loader/services/loader.service';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  constructor(private loader: LoaderService) {}

  allFormsGroup: FormGroup[] = []; // here i will store all the formgroups
  productdetailsObj: { [key: string]: any } = {};
  private product_id: string = '';
  private isEditMode: boolean = false;

  getEditMode(): boolean {
    return this.isEditMode;
  }
  startEditMode(productId: string): void {
    this.isEditMode = true;
    this.product_id = productId;
  }
  resetEditMode(): void {
    this.isEditMode = false;
    this.product_id = '';
  }

  private allFormsValidSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false); // To emit validity changes

  // Register a form with the service
  registerForm(form: FormGroup): void {
    if (form && !this.allFormsGroup.includes(form)) {
      this.allFormsGroup.push(form);
      this.updateFormsValidity();
    }
  }

  // reset the form

  resetForm(): void {
    this.allFormsGroup.forEach((form) => {
      console.log('reset form trigger');
      form.reset();
    });
  }

  // Trigger validation on all registered forms
  validateAllForms(): void {
    this.allFormsGroup.forEach((form) => {
      form.markAllAsTouched(); // Mark all form controls as touched
      // combine all the objects and make it one object
      this.productdetailsObj = this.allFormsGroup.reduce((acc, form) => {
        return Object.assign(acc, form.getRawValue());
      }, {});
    });
    if (this.isEditMode) {
      this.productdetailsObj['product_id'] = this.product_id;
    }
    console.log('final Object :- ', this.productdetailsObj);
    this.updateFormsValidity(); // After marking, update validity
  }

  private updateFormsValidity(): void {
    const allValid = this.allFormsGroup.every((form) => form.valid); // Returns true if all forms are valid
    console.log('function updateFormsValidity', allValid);
    this.allFormsValidSubject.next(allValid); // Emit the validity status using BehaviorSubject
  }

  // Edit value for the form
  populateFormsWithData(productDetails: any): void {
    // Start the process of populating the forms
    console.log(productDetails);
    this.loader.show();
    if (productDetails.product_id) {
      this.startEditMode(productDetails.product_id); // <--- SET EDIT MODE
      console.log('Edit mode ON, Product ID:', this.product_id);
    }
    setTimeout(() => {
      this.allFormsGroup.forEach((form: FormGroup) => {
        Object.keys(form.controls).forEach((controlName) => {
          const control = form.get(controlName);
          // Check if the control exists in the productDetails
          if (productDetails.hasOwnProperty(controlName)) {
            const value = productDetails[controlName];
            // If it's a simple FormControl, set the value
            if (control instanceof FormControl) {
              control.setValue(value);
            }
            // If it's a FormArray, delegate to populateFormArray method
            else if (control instanceof FormArray && Array.isArray(value)) {
              if (controlName === 'imagePreviews') {
                this.populateImagesArray(control, value); // MARKED
              } else {
                this.populateFormArray(control, value);
              }
            }
            // If it's a FormGroup, delegate to populateFormGroup method
            else if (
              control instanceof FormGroup &&
              typeof value === 'object'
            ) {
              this.populateFormGroup(control, value);
            }
          }
        });
      });
      this.loader.hide();
    }, 1000); // The delay is set to 500ms (can be adjusted as per your requirement)
  }

  // Recursively populate FormGroup controls
  private populateFormGroup(control: FormGroup, data: any): void {
    Object.entries(data).forEach(([key, value]) => {
      const nestedControl = control.get(key);
      // If the control exists in the FormGroup array
      if (nestedControl) {
        // If it's a FormControl, set its value
        if (nestedControl instanceof FormControl) {
          nestedControl.setValue(value);
        }
        // If it's a FormGroup, recursively call the function to populate nested FormGroup
        else if (nestedControl instanceof FormGroup) {
          this.populateFormGroup(nestedControl, value); // Recursively handle nested FormGroups
        }
        // If it's a FormArray, recursively call the function to populate nested FormArrays
        else if (nestedControl instanceof FormArray) {
          this.populateFormArray(nestedControl, value as any[]); // Recursively handle FormArrays
        }
      } else {
        if (Array.isArray(value)) {
          const formArray = new FormArray<FormControl<any>>([]);
          this.populateFormArray(formArray, value); // Recursively populate the array
          control.addControl(key, formArray);
        } else if (typeof value === 'object' && value !== null) {
          const formGroup = new FormGroup({});
          this.populateFormGroup(formGroup, value); // Recursively populate the group
          control.addControl(key, formGroup);
        } else {
          //variant value key _id is hideing
          // if (key != '_id') {
          control.addControl(key, new FormControl(value)); // Primitive value
          // }
        }
      }
    });
  }

  // Recursively populate FormArray controls
  private populateFormArray(control: FormArray, value: any[]): void {
    console.log('Populating FormArray', control, value);

    setTimeout(() => {
      control.clear(); // Clear the existing FormArray
      value.forEach((item) => {
        // console.log('item', item);
        if (Array.isArray(item)) {
          // If item is an array, create a nested FormArray
          control.push(new FormArray(item.map((val) => new FormControl(val))));
        } else if (typeof item === 'object') {
          // If item is an object, create a FormGroup and recursively populate it
          const group = new FormGroup({});
          this.populateFormGroup(group, item);
          control.push(group);
        } else {
          // If it's a primitive value, create a FormControl for it
          control.push(new FormControl(item));
        }
      });
    }, 500); // Adding a delay before FormArray population (can be adjusted)
  }

  private populateImagesArray(control: FormArray, value: string[]): void {
    control.clear();
    value.forEach((filename) => {
      const fullUrl = `http://localhost:3000/Images/${filename}`; // MARKED
      control.push(new FormControl(fullUrl));
    });
  }
}
