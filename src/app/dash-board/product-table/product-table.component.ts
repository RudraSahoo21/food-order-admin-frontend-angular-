import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../Loader/services/loader.service';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css',
})
export class ProductTableComponent {
  //variables
  productDetailsArray: any[] = [];
  isDeleteModalOpen: boolean = false;
  UserRole!: any;

  //constructor
  constructor(
    private api: ApiService,
    private router: Router,
    private loader: LoaderService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.resetTable();

    this.authService.user$.subscribe((user) => {
      this.UserRole = user;
      console.log('user', user);
      console.log('userRole', this.UserRole);
    });
  }

  getImageUrl(imageFileName: string): string {
    return `http://localhost:3000/Images/${imageFileName}`;
  }

  // reset button fuctionality
  resetTable() {
    this.loader.show();
    this.api.fetchAllProdDtls().subscribe({
      next: (res) => {
        if (res && res.success) {
          this.productDetailsArray = res.data;
          //this.productDetailsArray = res.data;
          this.totalItems = this.productDetailsArray.length;
          this.currentPage = 1;
          this.paginateData();
          console.log('Products:', this.productDetailsArray); // optional debug log
          setTimeout(() => {
            this.loader.hide();
          }, 1000);
        }
      },
      error: (err) => {
        console.error('Failed to fetch product details:', err);
      },
    });
  }

  searchProdDtl(prodName: any): void {
    console.log(prodName);
    if (prodName && prodName.trim() !== '') {
      const filtered = this.productDetailsArray.filter((product) =>
        product.productName.includes(prodName.trim())
      );
      this.productDetailsArray = filtered;
      this.totalItems = this.productDetailsArray.length;
      this.currentPage = 1;
      this.paginateData();
    } else {
      this.resetTable(); // restore original list if search is empty
    }
  }

  // delete modal open my button click function
  selectedProductName: string = '';
  _id: string = '';
  openDeleteModal(productName: string, id: string) {
    this.isDeleteModalOpen = true;
    this.selectedProductName = productName;
    this._id = id;
  }
  // delete modal close my button click function
  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }
  removeprodDtl() {
    this.api.removeProdDtl(this._id).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.productDetailsArray.length = 0;
          this.productDetailsArray = res.data;
          this.resetTable();
          this.closeDeleteModal();
          console.log('Products:', this.productDetailsArray);
        }
      },
      error: (err) => {
        console.error('Failed to delete product details:', err);
      },
    });
  }

  // Edit Button Fuctionalities
  edit(id: string) {
    this.api.editprodDtl(id).subscribe({
      next: (res) => {
        if (res && res.success) {
          const productDetails = res.data;
          this.router.navigate(['/homepage'], { state: { productDetails } });
        }
      },
      error: (err) => {
        console.log('Failed to edit the product details', err);
      },
    });
  }

  // pagination
  currentPage: number = 1;
  pageSize: number = 4; // Number of items per page
  totalItems: number = 0;
  pagedProducts: any[] = []; // Products to show on current page
  paginateData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedProducts = this.productDetailsArray.slice(startIndex, endIndex);
  }
  changePage(page: number) {
    this.currentPage = page;
    this.paginateData();
  }
  get totalPages(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
}
