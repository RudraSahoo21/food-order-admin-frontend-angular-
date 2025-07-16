import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommunicationService } from '../../communication.service';

@Component({
  selector: 'app-manage-variants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-variants.component.html',
  styleUrl: './manage-variants.component.css',
})
export class ManageVariantsComponent {
  constructor(private Service: CommunicationService) {}

  // ---------------------------------------------------------------------------static Inputs
  staticInputType: { id: string; name: string; value: string }[] = [
    {
      id: 'Size',
      name: 'Size',
      value: '',
    },
    {
      id: 'Base',
      name: 'Base',
      value: '',
    },
    {
      id: 'Quantity',
      name: 'Quantity',
      value: '',
    },
    {
      id: 'Preparation',
      name: 'Preparation',
      value: '',
    },
  ];

  // ---------------------------------------------------------------------------custom input type
  customInputType: { id: string; name: string; value: string }[] = [];
  addCustomInput(value: string): void {
    // Create a new object with the properties
    const newItem = {
      id: value,
      name: value,
      value: '',
    };
    // Push the new item into the array
    this.customInputType.push(newItem);
  }
  //finding index of customInput
  getIndexById(name: string): number {
    return this.customInputType.findIndex((item) => item.name === name);
  }
  //Remove Custom Input Value
  removeCustomInput(name: string) {
    const index = this.getIndexById(name);
    this.customInputType.splice(index, 1);
  }

  //---------------------------------------------------------------------------------checked Variant Type
  checkedVariant: { id: string; name: string; value: string }[] = [];
  isAnyVariantChecked: boolean = false; //check wheather a variant By is checked or not
  checked(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isAnyVariantChecked = target.checked;

    const id = target.id; // Get the 'id' of the element that triggered the event
    const newItem = {
      id: id,
      name: id,
      value: '',
    };
    // If the checkbox is checked, add the item
    if (target.checked) {
      // Check if the item already exists before adding
      const itemExists = this.checkedVariant.some((item) => item.id === id);
      if (!itemExists) {
        this.checkedVariant.push(newItem);
      }
    } else {
      // If the checkbox is unchecked, remove the item from the array
      this.checkedVariant = this.checkedVariant.filter(
        (item) => item.id !== id
      );
    }
  }

  // ------------------------------------------------ Sending data to footer
  isVisibleFooter: boolean = false;
  toggleStatus() {
    this.isVisibleFooter = true;
    this.Service.updateStatus(this.isVisibleFooter);
    this.Service.setCreateVariants(this.checkedVariant);
  }
}
