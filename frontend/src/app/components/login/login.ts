import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen mesh-gradient flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <!-- Logo / Welcome -->
      <div class="mb-10 text-center animate-fade-in-up flex flex-col items-center">
        <img src="/logos/tailor-cv-white.png" alt="TailorCV Logo" class="w-120 h-auto mb-2 drop-shadow-2xl logo-screen-blend object-contain">
        <p class="text-xl text-slate-300 font-medium max-w-sm">Create and manage your curriculum with artificial intelligence.</p>
      </div>

      <div class="max-w-md w-full space-y-8 bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-800">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-white">Sign in or Create CV</h2>
          <p class="mt-2 text-center text-sm text-slate-400">
            Welcome back to your premium portfolio.
          </p>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="username" class="sr-only">Username</label>
              <input id="username" formControlName="username" type="text" required class="appearance-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-800 placeholder-slate-400 text-white rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm" placeholder="Username">
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" formControlName="password" type="password" required class="appearance-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-800 placeholder-slate-400 text-white rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm" placeholder="Password">
            </div>
          </div>

          <div *ngIf="error" class="text-rose-500 text-sm text-center">
            {{ error }}
          </div>

          <div>
            <button type="submit" [disabled]="loginForm.invalid || loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:ring-offset-slate-900 disabled:opacity-50 transition-colors">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </div>
          
          <div class="text-center text-sm">
            <span class="text-slate-400">Don't have an account? </span>
            <a routerLink="/register" class="font-medium text-rose-500 hover:text-rose-400">Register here</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading = false;
  error = '';

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = res.error || 'Login failed';
          this.loading = false;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        this.error = 'Invalid credentials or server error';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
