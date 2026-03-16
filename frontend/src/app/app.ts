import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { DialogComponent } from './components/dialog/dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, DialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
