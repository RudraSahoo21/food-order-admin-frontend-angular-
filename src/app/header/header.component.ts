import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service';
import { FormValidationService } from '../form-validation.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isFormValid: Boolean = false;
  showErrorMessage: boolean = false;

  constructor(
    private service: CommunicationService,
    private formService: FormValidationService,
    private api: ApiService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.formService.validateAllForms();
    const isValid = this.formService.allFormsGroup.every((form) => form.valid);
    if (isValid) {
      this.sendDataToServer();
    }
  }

  sendDataToServer() {
    const productdetailsObj = this.formService.productdetailsObj;
    const isEditMode = this.formService.getEditMode();
    // debugger;
    if (isEditMode) {
      // PUT or PATCH request for editing existing product
      this.api
        .updateDetails(productdetailsObj['product_id'], productdetailsObj)
        .subscribe({
          next: (response) => {
            console.log('Product updated successfully:', response);
            this.formService.resetEditMode();
            this.goToNavigationPage('Updated');
          },
          error: (error) => {
            console.error('Error updating product:', error);
          },
        });
      //debugger;
    } else {
      debugger;
      // POST request for creating new product
      this.api.sendDetails(productdetailsObj).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.goToNavigationPage('Added');
        },
        error: (error) => {
          console.error('Error creating product:', error);
        },
      });
    }
    //debugger;
  }
  goToNavigationPage(message: 'Added' | 'Updated'): void {
    this.router.navigate(['/done'], { state: { message } });
  }
}
