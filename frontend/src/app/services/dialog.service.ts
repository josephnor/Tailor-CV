import { Injectable, signal } from '@angular/core';

export interface DialogOptions {
  type: 'alert' | 'confirm' | 'prompt';
  title: string;
  message?: string;
  defaultValue?: string;
  onConfirm?: (value?: string | boolean) => void;
  onCancel?: () => void;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  currentDialog = signal<DialogOptions | null>(null);

  confirm(title: string, message?: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.currentDialog.set({
        type: 'confirm',
        title,
        message,
        onConfirm: () => {
          this.currentDialog.set(null);
          resolve(true);
        },
        onCancel: () => {
          this.currentDialog.set(null);
          resolve(false);
        }
      });
    });
  }

  prompt(title: string, defaultValue: string = ''): Promise<string | null> {
    return new Promise((resolve) => {
      this.currentDialog.set({
        type: 'prompt',
        title,
        defaultValue,
        onConfirm: (val) => {
          this.currentDialog.set(null);
          resolve(val as string);
        },
        onCancel: () => {
          this.currentDialog.set(null);
          resolve(null);
        }
      });
    });
  }
}
