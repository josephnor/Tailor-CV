import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CvService, CvListItem } from '../../services/cv';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-cv-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cv-dashboard.html',
    styleUrl: './cv-dashboard.css'
})
export class CvDashboard implements OnInit {
    private cvService = inject(CvService);
    public authService = inject(AuthService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private toastService = inject(ToastService);
    private dialogService = inject(DialogService);

    cvList: CvListItem[] = [];
    loading = true;
    creating = false;

    ngOnInit() {
        this.loadCvs();
    }

    loadCvs() {
        const username = this.authService.currentUsername!;
        this.loading = true;
        this.cvService.listCvs(username).subscribe({
            next: (list) => {
                this.cvList = list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: () => {
                this.cvList = [];
                this.loading = false;
                this.cdr.markForCheck();
            }
        });
    }

    async createCv() {
        const label = await this.dialogService.prompt('Name for the new CV:', 'New CV');
        if (!label) return;

        this.creating = true;
        this.cvService.createCv(label).subscribe({
            next: (res) => {
                this.creating = false;
                this.toastService.show('CV created successfully', 'success');
                this.router.navigate(['/admin', res.cvId]);
            },
            error: () => {
                this.creating = false;
                this.toastService.show('Failed to create CV', 'error');
                this.cdr.markForCheck();
            }
        });
    }

    editCv(cvId: string) {
        this.router.navigate(['/admin', cvId]);
    }

    viewCv(cvId: string) {
        const username = this.authService.currentUsername;
        this.router.navigate(['/', username, cvId]);
    }

    async duplicateCv(cvId: string, currentLabel: string) {
        const newLabel = await this.dialogService.prompt('Label for the copy:', `${currentLabel} (Copy)`);
        if (!newLabel) return;

        this.cvService.duplicateCv(cvId, newLabel).subscribe({
            next: () => {
                this.toastService.show('CV duplicated', 'success');
                this.loadCvs();
            },
            error: () => this.toastService.show('Failed to duplicate CV', 'error')
        });
    }

    async deleteCv(cvId: string, label: string) {
        const confirmed = await this.dialogService.confirm('Delete CV', `Are you sure you want to delete "${label}"?`);
        if (!confirmed) return;

        this.cvService.deleteCv(cvId).subscribe({
            next: () => {
                this.toastService.show('CV deleted', 'info');
                this.loadCvs();
            },
            error: () => this.toastService.show('Failed to delete CV', 'error')
        });
    }

    setDefault(cvId: string) {
        this.cvService.setDefault(cvId).subscribe({
            next: () => {
                this.toastService.show('Default CV changed', 'success');
                this.loadCvs();
            },
            error: () => this.toastService.show('Failed to set default', 'error')
        });
    }

    formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}
