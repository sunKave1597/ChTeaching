import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full min-h-[calc(100vh-8rem)]">
      <div class="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100 h-full">
        
      </div>
    </main>
  `
})
export class MainComponent { }