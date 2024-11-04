import { Routes } from '@angular/router';
import {UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { HomeComponent } from './components/home/home.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RestrablecerComponent } from './components/restrablecer/restrablecer.component';
import { ProductoComponent } from './components/producto/producto.component';
import { ConsultasComponent } from './components/consultas/consultas.component';

export const routes: Routes = [
    {path: '', component: UserComponent},
    {path:'login',component:LoginComponent},
    {path:'carrito/:codigoBarras', component: CarritoComponent},
    {path:'carrito',component:CarritoComponent},
    {path:'inventario',component:InventarioComponent},
    {path:'home', component:HomeComponent},
    {path:'proveedor', component:ProveedoresComponent},
    {path:'registro', component:RegistroComponent},
    {path:'restablecer', component:RestrablecerComponent},
    {path:'producto', component:ProductoComponent},
    {path:'consultas', component:ConsultasComponent}
];
