import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CvService, CvData } from '../../services/cv';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { MarkdownPipe } from '../../pipes/markdown-pipe';
import { CvTemplateDefault } from './templates/cv-template-default';
import { CvTemplateElegant } from './templates/cv-template-elegant';
import { CvTemplateBold } from './templates/cv-template-bold';
import { CvTemplateClean } from './templates/cv-template-clean';

@Component({
  selector: 'app-cv-view',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MarkdownPipe, 
    CvTemplateDefault, 
    CvTemplateElegant, 
    CvTemplateBold, 
    CvTemplateClean
  ],
  templateUrl: './cv-view.html',
  styleUrl: './cv-view.css'
})
export class CvView implements OnInit {
  private cvService = inject(CvService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  data: CvData | null = null;
  loading = true;
  viewingUsername: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.viewingUsername = params.get('username');
      const cvId = params.get('cvId');

      if (this.viewingUsername) {
        this.loadCv(this.viewingUsername, cvId);
      }
    });
  }

  loadCv(username: string, cvId: string | null) {
    this.loading = true;
    const request = cvId
      ? this.cvService.getCv(username, cvId)
      : this.cvService.getDefaultCv(username);

    request.subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load CV data', err);
        this.loading = false;
        this.cdr.markForCheck();
        this.toastService.show('Could not load CV. It might not exist or is private.', 'error');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  printPdf() {
    window.print();
  }

  logout() {
    this.authService.logout();
  }
}
