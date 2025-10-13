import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bg-white shadow-lg p-4 text-center w-full">
      <h1 class="text-3xl font-extrabold text-indigo-700 sm:text-4xl">{{ title() }}</h1>
      <nav class="mt-3 space-x-4 sm:space-x-6">
        @for (link of navLinks(); track link.label) {
          <a [routerLink]="link.href" class="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150 text-base sm:text-lg">
            {{ link.label }}
          </a>
        }
      </nav>
    </header>
  `
})
export class HeaderComponent {
  protected readonly title = signal('ชื่อเว็บไซต์/โลโก้');
  protected readonly navLinks = signal([
    { label: 'หน้าหลัก', href: '/' },
    { label: 'บริการ', href: '/services' },
    { label: 'ติดต่อ', href: '/contact' }
  ]);
}