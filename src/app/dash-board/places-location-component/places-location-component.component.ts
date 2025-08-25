import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../api.service';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-places-location-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './places-location-component.component.html',
  styleUrl: './places-location-component.component.css',
})
export class PlacesLocationComponentComponent implements OnInit {
  //Injects
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.pageLoad();

    // filter By radius form Initialization
    this.filterByRadiusForm = this.fb.group({
      longitude: [
        '',
        [Validators.required, Validators.pattern(/^[-+]?[0-9]*\.?[0-9]+$/)],
      ],
      latitude: [
        '',
        [Validators.required, Validators.pattern(/^[-+]?[0-9]*\.?[0-9]+$/)],
      ],
      radiusInKm: [
        '',
        [Validators.required, Validators.pattern(/^[-+]?[0-9]*\.?[0-9]+$/)],
      ],
    });

    // Add form group initialization
    this.addNewLocationForm = this.fb.group({
      placeName: ['', Validators.required],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
    });

    // delete form initialization
    this.deleteLocationForm = this.fb.group({
      _id: ['', Validators.required],
      placeName: ['', Validators.required],
    });

    // edit form initialization
    this.editLocationForm = this.fb.group({
      _id: ['', Validators.required],
      placeName: ['', Validators.required],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
    });
  }

  // variables & array
  locationDetailsArr: location[] = []; //main array where server data stored permanently
  locationDetailsSubArr: location[] = []; //copy of mainarray for rendering data in UI
  currentPage: number = 1;
  itemsPerPage: number = 5;

  /** Functions */

  // when pageload data receive from server and mapped in main array then copy in subarray for render
  pageLoad(): void {
    this.api.fetchAllLocation().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.locationData)) {
          // store all the records received form server
          this.locationDetailsArr = res.locationData.map(
            (element: {
              _id: any;
              placeName: any;
              location: { coordinates: any[] };
            }) => ({
              _id: element._id,
              placeName: element.placeName,
              long: element.location.coordinates[0], // longitude
              lat: element.location.coordinates[1], // latitude
            })
          );
        }
        // copy all the records to sub array for render in Ui
        this.locationDetailsSubArr = [...this.locationDetailsArr];
        this.currentPage = 1;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //reload the table
  reloadTable(): void {
    this.locationDetailsSubArr = [...this.locationDetailsArr];
    this.currentPage = 1;
  }

  // Serch location by location name
  searchLocation(searchInput: HTMLInputElement): void {
    console.log(searchInput.value);
    const regex = new RegExp(searchInput.value, 'i');
    console.log(regex);
    this.locationDetailsSubArr = this.locationDetailsArr.filter((item: any) => {
      return regex.test(item.placeName);
    });
    searchInput.value = '';
  }

  // filter location by radius
  filterByRadiusForm!: FormGroup;
  filterByRadius() {
    if (this.filterByRadiusForm.invalid) {
      this.filterByRadiusForm.markAllAsTouched(); // highlights errors
      console.warn('Form invalid!', this.filterByRadiusForm.value);
      return;
    }
    const { longitude, latitude, radiusInKm } = this.filterByRadiusForm.value;
    const radiusInMeter = parseFloat(radiusInKm) * 1000;
    const payload = {
      long: parseFloat(longitude),
      lat: parseFloat(latitude),
      radius: radiusInMeter,
    };
    this.api.filterNearbyLocation(payload).subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.nearbyPlaces)) {
          this.locationDetailsSubArr = res.nearbyPlaces.map(
            (element: {
              _id: any;
              placeName: any;
              location: { coordinates: any[] };
            }) => ({
              _id: element._id,
              placeName: element.placeName,
              long: element.location.coordinates[0], // longitude
              lat: element.location.coordinates[1], // latitude
            })
          );
          this.currentPage = 1;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // pagination Function
  getCurrentPageItems(): location[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.locationDetailsSubArr.slice(startIndex, endIndex);
  }
  totalPages(): number {
    return Math.ceil(this.locationDetailsSubArr.length / this.itemsPerPage);
  }
  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  /**
   *************** Modal Related Functions are below *******************
   */

  // close all the modals
  closeModal(): void {
    const closeBtn = document.querySelector(
      '.modal.show  .btn-close'
    ) as HTMLElement;
    closeBtn?.click();
    this.addNewLocationForm.reset();
    this.deleteLocationForm.reset();
    this.editLocationForm.reset();
  }

  sendDataToModal(item: any): void {
    console.log(item);
    this.deleteLocationForm.patchValue({
      _id: item._id,
      placeName: item.placeName,
    });
    this.editLocationForm.patchValue({
      _id: item._id,
      placeName: item.placeName,
      longitude: item.long,
      latitude: item.lat,
    });
  }

  // Add Modal Functionalities
  addNewLocationForm!: FormGroup;
  addFormSubmit(): void {
    if (this.addNewLocationForm.invalid) {
      this.addNewLocationForm.markAllAsTouched();
      return;
    }
    const { placeName, longitude, latitude } = this.addNewLocationForm.value;
    const payload = {
      placeName: placeName,
      locationDetails: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    };
    // console.log(payload);
    this.api.addnewLocation(payload).subscribe({
      next: (res) => {
        console.log(res);
        this.closeModal();
        this.pageLoad();
      },
      error: (err) => {
        console.error('Error While Adding New Location', err);
        this.closeModal();
      },
    });
  }

  // Delete Modal Functionalities
  deleteLocationForm!: FormGroup;
  deleteFormSubmit(): void {
    const { _id } = this.deleteLocationForm.value;
    this.api.deleteLocation(_id).subscribe({
      next: (res) => {
        console.log(res.message);
        this.closeModal();
        this.pageLoad();
      },
      error: (err) => {
        console.log(err);
        this.closeModal();
      },
    });
  }

  // Edit Modal Functionalities
  editLocationForm!: FormGroup;
  editFormSubmit(): void {
    if (this.editLocationForm.invalid) {
      this.editLocationForm.markAllAsTouched();
      return;
    }
    const { _id, placeName, longitude, latitude } = this.editLocationForm.value;

    const payload = {
      _id: _id,
      placeName: placeName,
      location: {
        coordinates: [longitude, latitude],
      },
    };

    this.api.editLocation(payload).subscribe({
      next: (res) => {
        console.log(res);
        this.closeModal();
        this.pageLoad();
      },
      error: (err) => {
        console.error('Error while updateing location', err);
        this.closeModal();
      },
    });
  }
}

interface location {
  _id: string;
  placeName: string;
  long: number;
  lat: number;
}
