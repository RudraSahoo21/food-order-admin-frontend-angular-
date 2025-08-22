import { Routes } from '@angular/router';
import { DoneComponent } from './done/done.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavigationComponent } from './navigation/navigation.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { ProductTableComponent } from './dash-board/product-table/product-table.component';
import { CategoryListComponent } from './dash-board/category-list/category-list.component';
import { MenuListComponent } from './dash-board/menu-list/menu-list.component';
import { TaxationComponent } from './dash-board/taxation/taxation.component';
import { AddonListComponent } from './dash-board/addon-list/addon-list.component';
import { SignUpComponent } from './dash-board/sign-up/sign-up.component';
import { SignInComponent } from './dash-board/sign-in/sign-in.component';
import { authguardGuard } from './authguard.guard';
import { AccessPortalComponent } from './dash-board/access-portal/access-portal.component';
import { PlacesLocationComponentComponent } from './dash-board/places-location-component/places-location-component.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'DashBoard',
    pathMatch: 'full',
  },
  {
    path: 'landingpage',
    component: NavigationComponent,
    pathMatch: 'full',
  },
  {
    path: 'done',
    component: DoneComponent,
  },
  {
    path: 'homepage',
    component: HomepageComponent,
    canActivate: [authguardGuard],
    pathMatch: 'full',
  },
  {
    path: 'DashBoard',
    component: DashBoardComponent,

    children: [
      {
        path: 'productsTable',
        component: ProductTableComponent,
        canActivate: [authguardGuard],
      },
      {
        path: 'CategoryList',
        component: CategoryListComponent,
        canActivate: [authguardGuard],
      },
      {
        path: 'MenuList',
        component: MenuListComponent,
        canActivate: [authguardGuard],
      },
      {
        path: 'Taxation',
        component: TaxationComponent,
        canActivate: [authguardGuard],
      },
      {
        path: 'AddonList',
        component: AddonListComponent,
        canActivate: [authguardGuard],
      },
      { path: 'SingUP', component: SignUpComponent },
      { path: 'SignIn', component: SignInComponent },
      { path: 'Access-Portal', component: AccessPortalComponent },
      { path: 'Location', component: PlacesLocationComponentComponent },
    ],
  },
];
