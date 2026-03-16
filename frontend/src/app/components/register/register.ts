import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen mesh-gradient flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-800">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-white">Create Your CV</h2>
          <p class="mt-2 text-center text-sm text-slate-400">
            Join the platform and build your premium portfolio.
          </p>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="username" class="sr-only">Username</label>
              <input id="username" formControlName="username" type="text" required class="appearance-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-800 placeholder-slate-400 text-white rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm" placeholder="Username (no spaces)">
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" formControlName="password" type="password" required class="appearance-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-800 placeholder-slate-400 text-white rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm" placeholder="Password">
            </div>
          </div>

          <div *ngIf="error" class="text-rose-500 text-sm text-center">
            {{ error }}
          </div>
          <div *ngIf="successMsg" class="text-green-500 text-sm text-center">
            {{ successMsg }}
          </div>

          <div>
            <button type="submit" [disabled]="registerForm.invalid || loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:ring-offset-slate-900 disabled:opacity-50 transition-colors">
              {{ loading ? 'Creating...' : 'Register' }}
            </button>
          </div>
          
          <div class="text-center text-sm">
            <span class="text-slate-400">Already have an account? </span>
            <a routerLink="/login" class="font-medium text-rose-500 hover:text-rose-400">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  error = '';
  successMsg = '';

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.successMsg = '';

    const { username, password } = this.registerForm.value;
    this.authService.register(username, password).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMsg = 'Account created! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.error = res.error || 'Registration failed';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Server error during registration';
        this.loading = false;
      }
    });
  }
}
