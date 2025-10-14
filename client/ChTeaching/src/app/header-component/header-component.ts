import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bg-white p-4 shadow-md sticky top-0 z-10">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        
      </div>
    </header>
  `
})
export class HeaderComponent {
  constructor(private router: Router) {}

  // TODO: เพิ่มการนำทางสำหรับปุ่ม
}