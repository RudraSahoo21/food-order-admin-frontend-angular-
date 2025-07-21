import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { ToastServiceService } from '../toast/toast-service.service';

@Component({
  selector: 'app-access-portal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './access-portal.component.html',
  styleUrl: './access-portal.component.css',
})
export class AccessPortalComponent implements OnInit {
  ngOnInit(): void {
    // form group initialization
    this.accessPortalForm = this.fb.group({
      userId: ['', Validators.required],
      roleId: ['', Validators.required],
      customRoleId: this.fb.array([]),
    });

    // geting the user details from server and store it in the array
    this.featchAllUsers();
  }

  // injects
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastServiceService);

  // From Group
  accessPortalForm!: FormGroup;

  /*
   ****************************** Array ********************************
   */
  // array for store the user details comeing from server
  userDetailsArray: any = [];
  // array for storeing permission details and permission Id
  permissionsList = [
    // addon Id
    { label: 'View Addon', value: '6874b1c3b41e197b5e54f6c2' },
    { label: 'Create Addon', value: '6874ab7db41e197b5e54f699' },
    { label: 'Delete Addon', value: '6874ab8fb41e197b5e54f69d' },
    { label: 'Update Addon', value: '6874ab84b41e197b5e54f69b' },
    // Taxation Id
    { label: 'View Taxation', value: '6874b1aeb41e197b5e54f6c0' },
    { label: 'Create Taxation', value: '685baac5f0d923e6666a00f5' },
    { label: 'Delete Taxation', value: '685bac00f0d923e6666a00f9' },
    { label: 'Update Taxation', value: '685babf4f0d923e6666a00f7' },
    // MenuLabel Id
    { label: 'View MenuLabel', value: '6874b1a4b41e197b5e54f6be' },
    { label: 'Create MenuLabel', value: '6874aac6b41e197b5e54f693' },
    { label: 'Delete MenuLabel', value: '6874ab0db41e197b5e54f697' },
    { label: 'Update MenuLabel', value: '6874aaddb41e197b5e54f695' },
    // catagory Id
    { label: 'View Catagory', value: '6874b199b41e197b5e54f6bc' },
    { label: 'Create Catagory', value: '6874abd2b41e197b5e54f6a9' },
    { label: 'Delete Catagory', value: '6874abe3b41e197b5e54f6ad' },
    { label: 'Update Catagory', value: '6874abdab41e197b5e54f6ab' },
  ];

  /*
   **************************** Functions ******************************
   */

  //  get FormArray of accessPortalForm
  get customRoleId() {
    return this.accessPortalForm.get('customRoleId') as FormArray;
  }

  // fetch all users and store the data into array
  featchAllUsers() {
    this.api.fetchAllUsers().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.users)) {
          this.userDetailsArray = res.users;
          console.log(this.userDetailsArray);
        }
      },
      error: (err) => {
        console.log('Error :', err);
      },
    });
  }

  selectedUser(userdetails: Event) {
    const selectedUserId = (userdetails.target as HTMLSelectElement).value;
    console.log('Selected User', selectedUserId);
    const selectedUser = this.userDetailsArray.find(
      (user: any) => user._id === selectedUserId
    );
    if (selectedUser) {
      //  set assign role fetched form server
      const roleId = selectedUser.Role;
      this.accessPortalForm.get('roleId')?.setValue(roleId);
      // set assigned custom permission
      this.customRoleId.clear();
      selectedUser.customPermissions.forEach((element: any) => {
        this.customRoleId.push(this.fb.control(element));
      });
    }
  }
  // check Box Value checked of preset value comes form server
  isChecked(value: string): boolean {
    return this.customRoleId.value.includes(value);
  }

  // changed unchanged Toggle
  changeIsCheckedToggle(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const customPermissionValue = checkbox.value;
    if (checkbox.checked) {
      if (!this.customRoleId.value.includes(customPermissionValue)) {
        this.customRoleId.push(this.fb.control(customPermissionValue));
      }
    } else {
      const index = this.customRoleId.controls.findIndex(
        (ctrl) => ctrl.value === customPermissionValue
      );
      if (index !== -1) {
        this.customRoleId.removeAt(index);
      }
    }
    console.log(this.accessPortalForm.value);
  }

  // form submit
  onSubmit() {
    if (this.accessPortalForm.invalid) {
      this.accessPortalForm.markAllAsTouched(); // mark fields so errors show
      return;
    }
    const formData = this.accessPortalForm.value;
    // reset form
    this.accessPortalForm.reset({
      userId: '',
      roleId: '',
      customRoleId: [], // Or clear FormArray separately if needed
    });
    console.log('Valid Form Data:', formData);
    this.api.updateUserPermission(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.toast.show(res.message, res.type);
        this.featchAllUsers();
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }

  // toast
}
