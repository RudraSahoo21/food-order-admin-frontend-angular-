import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { FormValidationService } from '../../form-validation.service';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-menu-configuration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu-configuration.component.html',
  styleUrl: './menu-configuration.component.css',
})
export class MenuConfigurationComponent {
  menu_label: { id: number; name: string; label_id: any }[] = []; // menu label list array ( list data comes form server)
  menuForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private formService: FormValidationService,
    private api: ApiService
  ) {
    this.menuForm = this.fb.group({
      selectedItem: [''],
      selectedLabel: this.fb.array([]), // This replaces selectedLabel array
    });
  }

  ngOnInit(): void {
    this.api.fetchAllMenuLabels().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          this.menu_label = res.data.map((item: any) => ({
            label_id: item._id,
            id: item.index, // or item.id if you're using that as dropdown value
            name: item.label, // display name
          }));
        }
      },
      error: (err) => {
        console.error('Error fetching menu labels:', err);
      },
    });
    this.formService.registerForm(this.menuForm); // pushed this formgroup into the servicefile main formgroup array
  }

  // Getter for FormArray
  get selectedLabel(): FormArray {
    return this.menuForm.get('selectedLabel') as FormArray;
  }

  selectedOptions(): void {
    const selectedName = this.menuForm.get('selectedItem')?.value;
    const selectedObj = this.menu_label.find(
      (label) => label.name === selectedName
    );
    if (!selectedObj) return;
    const isAlreadyAdded = this.selectedLabel.value.includes(
      selectedObj.label_id
    );
    if (!isAlreadyAdded) {
      this.selectedLabel.push(new FormControl(selectedObj.label_id)); // store label_id
      this.menuForm.get('selectedItem')?.reset();
    }
  }

  removeTag(index: number): void {
    this.selectedLabel.removeAt(index);
  }

  getLabelName(labelId: string): string {
    const found = this.menu_label.find((item) => item.label_id === labelId);
    return found ? found.name : labelId;
  }

  // If you want to send this data to server
  getFormData(): any {
    return this.menuForm.value;
  }
}
