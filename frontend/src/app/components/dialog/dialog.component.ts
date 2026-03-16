import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="dialogService.currentDialog() as dialog" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in px-4">
      <div class="bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl p-6 w-full max-w-md animate-scale-in flex flex-col gap-2 relative overflow-hidden text-slate-100">
        
        <!-- Glow effect -->
        <div class="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" *ngIf="dialog.type === 'prompt'"></div>
        <div class="absolute -top-10 -left-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none" *ngIf="dialog.type === 'confirm'"></div>

        <h3 class="font-bold text-lg leading-tight">{{ dialog.title }}</h3>
        <p *ngIf="dialog.message" class="text-slate-400 text-sm mb-2">{{ dialog.message }}</p>
        
        <div class="mt-3 w-full" *ngIf="dialog.type === 'prompt'">
            <input #promptInput
                   [autofocus]="true"
                   type="text" 
                   [(ngModel)]="promptValue" 
                   class="w-full bg-slate-800/80 border border-emerald-500/30 text-white rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-sm" 
                   (keydown.enter)="dialog.onConfirm?.(promptValue)" />
        </div>
               
        <div class="flex justify-end gap-3 mt-5">
          <button (click)="dialog.onCancel?.()" class="px-5 py-2.5 rounded-full text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95">Cancel</button>
          
          <!-- Confirm Button -->
          <button *ngIf="dialog.type === 'confirm'" (click)="dialog.onConfirm?.(true)" class="px-5 py-2.5 rounded-full text-sm font-bold bg-red-600/90 text-white hover:bg-red-500 transition shadow-[0_0_15px_rgba(220,38,38,0.3)] active:scale-95 border border-red-500/50">Accept</button>
          
          <!-- Prompt Button -->
          <button *ngIf="dialog.type === 'prompt'" (click)="dialog.onConfirm?.(promptValue)" class="px-5 py-2.5 rounded-full text-sm font-bold bg-emerald-600/90 text-white hover:bg-emerald-500 transition shadow-[0_0_15px_rgba(5,150,105,0.3)] active:scale-95 border border-emerald-500/50">Accept</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in { animation: fadeIn 0.15s ease-out forwards; }
    .animate-scale-in { animation: scaleIn 0.15s ease-out forwards; }
  `]
})
export class DialogComponent {
  dialogService = inject(DialogService);
  promptValue = '';

  constructor() {
    effect(() => {
      const dialog = this.dialogService.currentDialog();
      if (dialog && dialog.type === 'prompt') {
        this.promptValue = dialog.defaultValue || '';
      }
    });
  }
}
