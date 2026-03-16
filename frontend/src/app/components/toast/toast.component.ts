import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <div *ngFor="let toast of toastService.toasts()" 
           class="pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white text-sm font-bold min-w-[300px] animate-fade-in-up transition-all"
           [ngClass]="{
             'bg-emerald-600': toast.type === 'success',
             'bg-red-600': toast.type === 'error',
             'bg-slate-800': toast.type === 'info'
           }">
        <span>{{ toast.message }}</span>
        <button (click)="toastService.remove(toast.id)" class="ml-auto opacity-70 hover:opacity-100 transition">✕</button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out forwards;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
