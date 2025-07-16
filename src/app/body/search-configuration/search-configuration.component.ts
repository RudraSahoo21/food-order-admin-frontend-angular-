import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
} from '@angular/forms';
import { FormValidationService } from '../../form-validation.service';

@Component({
  selector: 'app-search-configuration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-configuration.component.html',
  styleUrl: './search-configuration.component.css',
})
export class SearchConfigurationComponent {
  searchConfigForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private formService: FormValidationService
  ) {
    this.searchConfigForm = this.fb.group({
      tags: [''], // Input box value
      tagsArray: this.fb.array([]), // FormArray to store actual tags
    });
  }

  ngOnInit(): void {
    this.formService.registerForm(this.searchConfigForm); // pushed this formgroup into the servicefile main formgroup array
  }

  // Getter for easier access
  get tagsArray(): FormArray {
    return this.searchConfigForm.get('tagsArray') as FormArray;
  }

  add(): void {
    const tagValue = this.searchConfigForm.get('tags')?.value?.trim();
    if (tagValue) {
      this.tagsArray.push(new FormControl(tagValue)); // Add tag to FormArray
      this.searchConfigForm.get('tags')?.reset(); // Clear input
    }
  }

  remove(index: number): void {
    this.tagsArray.removeAt(index); // Remove tag at index
  }
}
