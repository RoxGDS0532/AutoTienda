import { Routes } from '@angular/router';
import {UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {path: '', component: UserComponent},
    {path:'login',component:LoginComponent}
];
