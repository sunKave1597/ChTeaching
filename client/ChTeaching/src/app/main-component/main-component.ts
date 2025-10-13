import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full min-h-[calc(100vh-8rem)]">
      <div class="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100 h-full">
        <h2 class="text-2xl sm:text-3xl font-semibold mb-4 text-gray-700">ยินดีต้อนรับสู่เว็บไซต์ของเรา</h2>
        <p class="text-gray-600 mb-6 leading-relaxed">
          นี่คือพื้นที่สำหรับเนื้อหาหลักของหน้าเว็บ เช่น บทความ ข้อมูลสินค้า หรือบริการต่าง ๆ
          เรามุ่งมั่นที่จะนำเสนอสิ่งที่ดีที่สุดให้แก่คุณ
        </p>
        <section class="mt-8 pt-6 border-t border-indigo-200">
          <h3 class="text-xl sm:text-2xl font-semibold mb-3 text-indigo-600">หัวข้อเสริมที่น่าสนใจ</h3>
          <p class="text-gray-600">
            เนื้อหาเสริมที่เกี่ยวข้องกับหัวข้อหลัก คุณสามารถใส่ข้อมูลเพิ่มเติมหรือฟีเจอร์เด่น ๆ ได้ในส่วนนี้
            เพื่อให้ผู้เยี่ยมชมได้รับข้อมูลที่ครบถ้วน
          </p>
        </section>
      </div>
    </main>
  `
})
export class MainComponent { }