import { Routes } from '@angular/router';
import { CarList } from './features/cars/pages/car-list/car-list';
import { CarForm } from './car-form/car-form';
import { CarDetails } from './car-details/car-details';
import { Register } from './features/auth/pages/register/register';
import { LoginComponent } from './features/auth/pages/login/login';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cars',
    pathMatch: 'full'
  },
  {
    path: 'cars',
    component: CarList
  },
{
    path: 'cars/new',
    component: CarForm
  },
  {
    path: "cars/:id",
    component: CarDetails
  },
  {
    path: 'cars/:id/edit',
    component: CarForm
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: "login",
    component: LoginComponent
  }


];

