import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-places-location-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './places-location-component.component.html',
  styleUrl: './places-location-component.component.css',
})
export class PlacesLocationComponentComponent implements OnInit {
  //Injects
  private api = inject(ApiService);

  ngOnInit(): void {
    this.pageLoad();
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //reload the table
  reloadTable(): void {
    this.locationDetailsSubArr = [...this.locationDetailsArr];
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
}

interface location {
  _id: string;
  placeName: string;
  long: number;
  lat: number;
}
