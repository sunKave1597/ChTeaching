import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page-component/landing-page-component';
import { MainContainerComponent } from './main-container-component/main-container-component';
import { LoginLayoutComponent } from './login-layout-component/login-layout-component';
import { RegisterLayoutComponent } from './register-layout.component/register-layout.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, title: 'หน้าแรก' },
  { path: 'login', component: LoginLayoutComponent, title: 'เข้าสู่ระบบ' },
  { path: 'home', component: MainContainerComponent, title: 'หน้าหลัก' },
  { path: 'register', component: RegisterLayoutComponent },
  { path: '**', redirectTo: '' }
];