import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFormComponent } from '../login-form-component/login-form-component';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex items-center justify-center min-h-screen bg-white p-4">
      <button (click)="goBack()" class="absolute top-4 left-4 p-2 rounded-full bg-[#9D1616] text-white hover:bg-[#7B1111] transition duration-200">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <div class="w-full max-w-md p-10 space-y-10 bg-white rounded-2xl shadow-2xl min-h-[400px]">
        <h2 class="text-3xl font-bold text-center text-[#9D1616] mb-2">เข้าสู่ระบบ</h2>
        <app-login-form />
      </div>
    </div>
  `
})
export class LoginLayoutComponent {
  constructor(private router: Router) {}

  goBack() {
    console.log('Back button clicked, navigating to /');
    this.router.navigateByUrl('/').then(success => {
      console.log('Navigation success:', success);
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }
}