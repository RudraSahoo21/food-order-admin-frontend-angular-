import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  constructor() {}

  private statusSubject = new BehaviorSubject<boolean>(false);
  currentStatus$ = this.statusSubject.asObservable(); //obserable
  // Function for Footer Area Visibility
  updateStatus(status: boolean) {
    this.statusSubject.next(status);
  }
  // Body components form validation
  formvalidation(isValid: boolean) {
    this.statusSubject.next(isValid);
  }

  //........................................................reciveing data from Manage Variants and sending it to footer
  private variantReciveingData = new BehaviorSubject<any[]>([]);
  //recive from manage-variant
  setCreateVariants(variant: object[]) {
    this.variantReciveingData.next(variant);
  }
  //send to footer
  getCreateVariants() {
    return this.variantReciveingData.asObservable();
  }

  //-----------------------------------------------------------receiveing data from priceing component
  private packageingCost = new BehaviorSubject<any>(0);
  packageingCostData$ = this.packageingCost.asObservable();
  updatePackageingCost(data: any): void {
    this.packageingCost.next(data);
    // console.log(data);
  }
  private taxrate = new BehaviorSubject<any>(0);
  taxreteData$ = this.taxrate.asObservable();
  updateTaxrate(data: any): void {
    this.taxrate.next(data);
  }

  //-----------------------------------------------------------AddOn section
  private addOnSection = new BehaviorSubject<boolean>(false);
  addOnSection$ = this.addOnSection.asObservable();
  toggleAddonSection(status: boolean) {
    this.addOnSection.next(status);
  }

  // ---------------------------------------------------- add Modal Open and adding the data
  //modal data transfer for body component
  private modalOpenInBody = new BehaviorSubject<boolean>(false);
  modalOpenInBody$ = this.modalOpenInBody.asObservable();
  modalOpen(status: boolean) {
    this.modalOpenInBody.next(status);
  }
  private modalFormData = new BehaviorSubject<any>(null);
  modalFormData$ = this.modalFormData.asObservable();
  setModalFormData(data: object) {
    this.modalFormData.next(data); // sending modal data towords body
  }
  //modal data transfer for footer component
  private isFooterAddonChecked = new BehaviorSubject<boolean>(false);
  isFooterAddonChecked$ = this.isFooterAddonChecked.asObservable();
  footerAddonChecked(status: boolean) {
    this.isFooterAddonChecked.next(status);
  }
  private isModalOpenByFooter = new BehaviorSubject<boolean>(false);
  isModalOpenByFooter$ = this.isModalOpenByFooter.asObservable();
  modalopenByFooter(status: boolean) {
    this.isModalOpenByFooter.next(status);
  }
  private modalDataToFooter = new BehaviorSubject<any>(null);
  modalDataToFooter$ = this.modalDataToFooter.asObservable();
  setmodalDataToFooter(data: object) {
    this.modalDataToFooter.next(data);
  }

  //---------------------------------------------------- Delete Modal Open and delete the data accordingly
  private deleteModalOpenForProduct = new BehaviorSubject<boolean>(false);
  deleteModalOpenForProduct$ = this.deleteModalOpenForProduct.asObservable();
  isdeleteModalOpenForProduct(status: boolean) {
    this.deleteModalOpenForProduct.next(status);
  }
  //delete addon on body
  private deleteProductAddons = new BehaviorSubject<boolean>(false);
  deleteProductAddons$ = this.deleteProductAddons.asObservable();
  isdeleteProductAddons(status: boolean) {
    this.deleteProductAddons.next(status);
  }
  //delete variantaddon on footer
  private deleteVariantAddons = new BehaviorSubject<boolean>(false);
  deleteVariantAddons$ = this.deleteVariantAddons.asObservable();
  isdeleteVariantAddons(status: boolean) {
    this.deleteVariantAddons.next(status);
  }
  //delete variant
  // private deleteVariant = new BehaviorSubject<boolean>(false);
  // deleteVariant$ = this.deleteVariantAddons.asObservable();
  // isdeleteVariant(status: boolean) {
  //   this.deleteVariant.next(status);
  // }
}
