import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col relative overflow-visible">
      <div class="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div class="w-[200px] h-[200px] bg-white rounded-full relative border-2 border-gray-300">
          <img src="/img/logo.png" class="absolute inset-0 m-auto max-w-[80%] max-h-[80%] object-contain" alt="Logo">
        </div>
      </div>
      <div class="h-[40vh] bg-[#9D1616] relative">
        <h1 class="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#FCB137] text-4xl font-bold z-10">
          飛会
        </h1>
        <p class="absolute top-[40%] left-1/2 transform -translate-x-1/2 text-[#FCB137] text-2xl z-10">
          feihui chinese
        </p>
      </div>
      <div class="flex-grow bg-white rounded-t-[2rem] relative flex items-center justify-center">
        <div class="flex flex-col space-y-6 w-full max-w-md z-10">
          <button (click)="navigateTo('home')"
                  class="w-[90%] mx-auto px-8 py-2 bg-[#9D1616] text-white font-medium rounded-2xl hover:bg-[#7B1111] transition duration-200 text-lg">
            หน้าหลัก
          </button>
          <button (click)="navigateTo('register')"
                  class="w-[90%] mx-auto px-8 py-2 bg-[#9D1616] text-white font-medium rounded-2xl hover:bg-[#7B1111] transition duration-200 text-lg">
            สมัครสมาชิก
          </button>
          <button (click)="navigateTo('login')"
                  class="w-[90%] mx-auto px-8 py-2 bg-[#9D1616] text-white font-medium rounded-2xl hover:bg-[#7B1111] transition duration-200 text-lg">
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