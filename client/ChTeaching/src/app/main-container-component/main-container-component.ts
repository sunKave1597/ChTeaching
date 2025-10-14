import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HeaderComponent } from '../header-component/header-component';
import { MainComponent } from '../main-component/main-component';
import { FooterComponent } from '../footer-component/footer-component';

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [HeaderComponent, MainComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col min-h-screen bg-gray-50">
      @if (showHeader()) {
        <app-header class="sticky top-0 z-10" />
      }
      <app-main class="flex-grow" />
      @if (showFooter()) {
        <app-footer class="sticky bottom-0 z-10" />
      }
    </div>
  `
})
export class MainContainerComponent {
  protected readonly showHeader = signal(true);
  protected readonly showFooter = signal(true);
}