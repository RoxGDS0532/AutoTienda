import { Routes } from '@angular/router';
import {UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { CarritoComponent } from './components/carrito/carrito.component';

export const routes: Routes = [
    {path: '', component: UserComponent},
    {path:'login',component:LoginComponent},
    {path:'carrito', component: CarritoComponent}
];
