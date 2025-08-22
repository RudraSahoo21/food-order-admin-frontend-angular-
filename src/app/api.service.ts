import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  //send all the details to DB
  sendDetails(input: object) {
    return this.http.post<any[]>(
      'http://localhost:3000/addProductDetails',
      input
    );
  }

  //fetch all the details when pageload or reset.
  fetchAllProdDtls() {
    return this.http.post<any>('http://localhost:3000/allProdDetails', {});
  }

  //search product details by product name.
  searchOneProdDtl(productName: string) {
    return this.http.post<any>('http://localhost:3000/search', {
      productName: productName,
    });
  }

  // Delete the product
  removeProdDtl(_id: string) {
    return this.http.delete<any>('http://localhost:3000/deleteProd', {
      body: { _id },
    });
  }

  // update the product details
  // catch the the data from server then store it into my existing form
  editprodDtl(_id: string) {
    return this.http.post<any>('http://localhost:3000/update', { _id });
  }
  updateDetails(_id: string, obj: any) {
    return this.http.patch<any>('http://localhost:3000/updateDetails', {
      _id,
      obj,
    });
  }

  // fetch menulabel data when form load
  fetchAllMenuLabels(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(
      'http://localhost:3000/featchAllMenuLabel',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // fetch all the category list from server when load the form
  fetchAllCategoryList(): Observable<any> {
    return this.http.post<any>('http://localhost:3000/featchAllCategory', {});
  }

  // fetch all the Sub-Category list form server when load the form
  fetchAllSubCategoryList(): Observable<any> {
    return this.http.post<any>('http://localhost:3000/fetchAllSubCategory', {});
  }

  // search addons
  searchAddonList(catagory: string, name: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/searchAddons', {
      catagory,
      name,
    });
  }

  // Add new MenuList Item Api
  addnewMenu(label: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(
      'http://localhost:3000/NewMenuLabel',
      { label },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // Delete MenuList Item
  deleteMenuItem(_id: string): Observable<any> {
    return this.http.delete<any>('http://localhost:3000/', {
      body: { _id },
    });
  }

  // fetch tax rates
  fetchAllTaxes(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(
      'http://localhost:3000/featchTaxes',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // Add new tax rates
  addnewTax(formdata: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>('http://localhost:3000/addnewtaxes', formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Edit existing taxes
  editTaxes(data: object): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.patch<any>('http://localhost:3000/editTax', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // delete tax
  deleteTax(id: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>('http://localhost:3000/deletetax', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { id },
    });
  }

  // fetch combined catagory and sub catagory list for admin table
  fetchCombinedCatSubcat(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(
      'http://localhost:3000/addCatSubcat',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // update menu Label name
  editMenuLabelName(data: object): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.patch<any>('http://localhost:3000/editmenulabel', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // remove menu Label name
  removeMenuLabel(id: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>('http://localhost:3000/removeMenuLabel', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { id },
    });
  }

  // fetch all addons
  fetchAllAddons(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(
      'http://localhost:3000/fetchAllAddons',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // add new addon on the list
  addAddons(payload: object): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>('http://localhost:3000/addAddons', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // update addon data
  updateAddons(payload: object): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.patch<any>('http://localhost:3000/updateAddons', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // delete addon details
  deleteAddon(id: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>('http://localhost:3000/removeAddon', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { id },
    });
  }

  // add new catagory and sub catagory
  addCatagorySubcatagory(formdata: any): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/addCatagory&SubCatagory',
      formdata
    );
  }

  // User Signup
  UserSignup(formdata: object): Observable<any> {
    return this.http.post<any>('http://localhost:3000/UserCreation', formdata);
  }

  // User Login
  UserLogin(email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/SignIn', {
      UserEmail: email,
      password: password,
    });
  }

  // fetching user details for access portal
  fetchAllUsers(): Observable<any> {
    return this.http.post<any>('http://localhost:3000/admin/allusers', {});
  }

  // update user permission details by admin in accessportal
  updateUserPermission(updatePermission: any): Observable<any> {
    return this.http.patch<any>(
      'http://localhost:3000/updateUserPermission',
      updatePermission
    );
  }
}
