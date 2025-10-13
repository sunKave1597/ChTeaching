import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <div class="relative">
        <input type="text" id="username"
               class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#9D1616] focus:border-[#9D1616] transition duration-150 bg-[#D9D9D9]"
               placeholder="ชื่อผู้ใช้งาน">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9D1616]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
      <div class="relative">
        <input type="password" id="password"
               class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#9D1616] focus:border-[#9D1616] transition duration-150 bg-[#D9D9D9]"
               placeholder="รหัสผ่าน">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9D1616]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2zm0 0c0 1.104-.896 2-2 2s-2-.896-2-2m0 0v4m-4 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2z"></path>
        </svg>
      </div>
      <button (click)="onLoginClick()"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-[#9D1616] hover:bg-[#7B1111] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9D1616] transition duration-200">
        เข้าสู่ระบบ
      </button>
    </div>
  `
})
export class LoginFormComponent {
  constructor(private router: Router) {}

  onLoginClick() {
    console.log('Login button clicked, navigating to /home');
    this.router.navigateByUrl('/home').then(success => {
      console.log('Navigation success:', success);
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }
}