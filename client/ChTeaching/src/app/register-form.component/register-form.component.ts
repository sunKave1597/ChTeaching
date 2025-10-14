import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../env';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <div class="relative">
        <input type="text" id="username" [(ngModel)]="username"
               class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#9D1616] focus:border-[#9D1616] transition duration-150 bg-[#D9D9D9]"
               placeholder="ชื่อผู้ใช้งาน">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9D1616]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
      <div class="relative">
        <input type="email" id="email" [(ngModel)]="email"
               class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#9D1616] focus:border-[#9D1616] transition duration-150 bg-[#D9D9D9]"
               placeholder="อีเมล">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9D1616]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      </div>
      <div class="relative">
        <input type="password" id="password" [(ngModel)]="password"
               class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#9D1616] focus:border-[#9D1616] transition duration-150 bg-[#D9D9D9]"
               placeholder="รหัสผ่าน">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9D1616]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2zm0 0c0 1.104-.896 2-2 2s-2-.896-2-2m0 0v4m-4 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2z"></path>
        </svg>
      </div>
      <div class="relative">
        <input type="password" id="confirmPassword" [(ngModel)]="confirmPassword"
               class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#9D1616] focus:border-[#9D1616] transition duration-150 bg-[#D9D9D9]"
               placeholder="ยืนยันรหัสผ่าน">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9D1616]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2zm0 0c0 1.104-.896 2-2 2s-2-.896-2-2m0 0v4m-4 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2z"></path>
        </svg>
      </div>
      <button (click)="onRegisterClick()"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-[#9D1616] hover:bg-[#7B1111] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9D1616] transition duration-200">
        สมัครสมาชิก
      </button>
    </div>
  `
})
export class RegisterFormComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  onRegisterClick() {
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    const registerData = {
      name: this.username,
      email: this.email,
      password: this.password
    };

    this.http.post(`${environment.apiUrl}/auth/register`, registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigateByUrl('/login').then(success => {
          console.log('Navigation success:', success);
        });
      },
      error: (error) => {
        console.error('Registration error:', error);
      }
    });
  }
}