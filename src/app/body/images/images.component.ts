import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { FormValidationService } from '../../form-validation.service';

@Component({
  selector: 'app-images',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
})
export class ImagesComponent implements OnInit {
  ImageFrom: FormGroup;

  constructor(
    private fb: FormBuilder,
    private formService: FormValidationService
  ) {
    this.ImageFrom = this.fb.group({
      imagePreviews: this.fb.array([]),
    });
  }

  get imagePreviews() {
    return this.ImageFrom.get('imagePreviews') as FormArray;
  }

  ngOnInit(): void {
    this.formService.registerForm(this.ImageFrom);
  }

  enlargedImageIndex: number | null = null; // Track the enlarged image index

  // Handles the image selection and stores multiple images
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const files = input.files;
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            // Add image to preview array
            this.imagePreviews.push(new FormControl(reader.result));
            console.log('Image preview added:', reader.result);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // Toggle enlargement for the clicked image
  onStarClick(index: number): void {
    this.enlargedImageIndex = this.enlargedImageIndex === index ? null : index;
  }

  // Remove image from the preview list and form array
  onRemoveImage(index: number): void {
    // Remove from the form array (imagePreviews)
    this.imagePreviews.removeAt(index);

    // Adjust enlargedImageIndex if necessary
    if (this.enlargedImageIndex === index) {
      this.enlargedImageIndex = null;
    } else if (
      this.enlargedImageIndex !== null &&
      this.enlargedImageIndex > index
    ) {
      this.enlargedImageIndex -= 1;
    }
  }
}
