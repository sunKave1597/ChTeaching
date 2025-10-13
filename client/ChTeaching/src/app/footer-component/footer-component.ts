import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-gray-800 text-white p-4 text-center text-sm sm:p-6 w-full">
      <p class="mb-2">&copy; 2025 ชื่อบริษัทของคุณ | สงวนลิขสิทธิ์</p>
      <div class="space-x-4">
        @for (link of socialLinks(); track link.label) {
          <a [href]="link.href" class="text-indigo-300 hover:text-indigo-100 transition duration-150">
            {{ link.label }}
          </a>
        }
      </div>
    </footer>
  `
})
export class FooterComponent {
  protected readonly socialLinks = signal([
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'Twitter', href: 'https://twitter.com' }
  ]);
}