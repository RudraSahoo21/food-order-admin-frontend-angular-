import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { CommunicationService } from '../../communication.service';

@Component({
  selector: 'app-addons',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addons.component.html',
  styleUrl: './addons.component.css',
})
export class AddonsComponent implements OnInit {
  addOnListForm!: FormGroup;
  openModal: boolean = false; // variable used for opening the modal
  deleteModalOpen: boolean = false; //variable used for opening the  delete modal

  constructor(private fb: FormBuilder, private service: CommunicationService) {
    this.addOnListForm = new FormGroup({
      addOnListArray: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.service.modalFormData$.subscribe((data) => {
      this.addOnrecivedData(data);
    });

    this.service.deleteProductAddons$.subscribe((status) => {
      if (status) {
        this.removeAddOns(status);
      }
    });
  }

  get addOnListArray() {
    return this.addOnListForm.get('addOnListArray') as FormArray;
  }

  // modal Open
  addAddOns() {
    this.openModal = true;
    this.service.modalOpen(this.openModal);
    this.openModal = false;
  }

  //recived data
  addOnrecivedData(receivedData: object) {
    if (receivedData != null) {
      const addonGroups: FormGroup = this.fb.group({
        addonCategory: [''],
        description: [''],
        addonName: [''],
        addonPrice: [''],
        taxPercentage: [],
        taxrate: [],
        type: [''],
      });
      addonGroups.patchValue(receivedData);
      console.log('addOnGroup', addonGroups);
      this.addOnListArray.push(addonGroups);
      console.log('addOnListArray', this.addOnListArray);
    }
  }

  // delete modal open
  selectProductIndex: number = 0;
  openDeleteModal(index: number) {
    this.deleteModalOpen = true;
    this.selectProductIndex = index;
    this.service.isdeleteModalOpenForProduct(this.deleteModalOpen);
    this.deleteModalOpen = false;
  }
  //remove button functionalities
  removeAddOns(status: boolean) {
    if (status) {
      this.addOnListArray.removeAt(this.selectProductIndex);
    }
  }
}
