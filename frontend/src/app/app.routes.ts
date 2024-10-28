import { Routes } from '@angular/router';
import {UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {path: '', component: UserComponent},
    {path:'login',component:LoginComponent},
    {path:'carrito', component: CarritoComponent},
    {path:'inventario',component:InventarioComponent},
    {path:'home', component:HomeComponent}
];
