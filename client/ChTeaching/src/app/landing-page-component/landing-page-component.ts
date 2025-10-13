import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col">
      <div class="h-[50vh] bg-[#9D1616]"></div>
      <div class="flex-grow bg-white rounded-t-[2rem] flex items-center justify-center">
        <div class="flex flex-col space-y-6 w-full max-w-md">
          <button (click)="navigateTo('home')"
                  class="w-[90%] mx-auto px-8 py-3 bg-[#9D1616] text-white font-medium rounded-2xl hover:bg-[#7B1111] transition duration-200 text-lg">
            หน้าหลัก
          </button>
          <button (click)="navigateTo('register')"
                  class="w-[90%] mx-auto px-8 py-3 bg-[#9D1616] text-white font-medium rounded-2xl hover:bg-[#7B1111] transition duration-200 text-lg">
            สมัครสมาชิก
          </button>
          <button (click)="navigateTo('login')"
                  class="w-[90%] mx-auto px-8 py-3 bg-[#9D1616] text-white font-medium rounded-2xl hover:bg-[#7B1111] transition duration-200 text-lg">
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  `
})
export class LandingPageComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    console.log('Navigating to:', path);
    this.router.navigateByUrl(`/${path}`).then(success => {
      console.log('Navigation success:', success);
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }
}