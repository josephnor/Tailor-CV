import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, FormArray, Validators } from '@angular/forms';
import { CvService, CvData } from '../../services/cv';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-editor',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-editor.html',
  styleUrl: './admin-editor.css'
})
export class AdminEditor implements OnInit {
  private cvService = inject(CvService);
  public authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  cvId: string | null = null;
  cvLabel: string = 'My CV';

  cvForm!: FormGroup;
  loading = true;
  saving = false;

  // AI Tailor State
  showAiPanel = false;
  aiLoading = false;
  aiJobDescription = '';
  aiJobUrl = '';

  get skills() { return this.cvForm.get('skills') as FormArray; }
  get languages() { return this.cvForm.get('languages') as FormArray; }
  get experience() { return this.cvForm.get('experience') as FormArray; }
  get education() { return this.cvForm.get('education') as FormArray; }
  get coreValues() { return this.cvForm.get('coreValues') as FormArray; }
  get certifications() { return this.cvForm.get('certifications') as FormArray; }
  get customFields() { return this.cvForm.get('contact.customFields') as FormArray; }

  ngOnInit() {
    const username = this.authService.currentUsername!;

    this.route.paramMap.subscribe(params => {
      const id = params.get('cvId');
      if (id) {
        this.cvId = id;
        this.loadCvData(username, id);
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  private loadCvData(username: string, cvId: string) {
    this.loading = true;
    this.cdr.markForCheck();

    this.cvService.getCv(username, cvId).subscribe({
      next: (data) => {
        this.cvLabel = data.label || 'My CV';
        this.initForm(data);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load CV', err);
        this.toastService.show('Failed to load CV data. Returning to dashboard.', 'error');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  private initForm(data: CvData) {
    const profile = data.profile || {};
    const contact = data.contact || {};

    this.cvForm = this.fb.group({
      profile: this.fb.group({
        firstName: [profile.firstName || '', Validators.required],
        lastName: [profile.lastName || '', Validators.required],
        subtitle: [profile.subtitle || ''],
        photoPath: [profile.photoPath || ''],
        summary: [profile.summary || ''],
        quote: [profile.quote || '']
      }),
      contact: this.fb.group({
        phone: [contact.phone || ''],
        email: [contact.email || '', Validators.email],
        location: [contact.location || ''],
        linkedin: [contact.linkedin || ''],
        linkedinUrl: [contact.linkedinUrl || ''],
        customFields: this.fb.array((contact.customFields || []).map((f: any) => this.fb.group({
          label: [f.label || ''],
          value: [f.value || ''],
          link: [f.link || '']
        })))
      }),
      skills: this.fb.array((data.skills || []).map(s => this.fb.control(s))),
      coreValues: this.fb.array((data.coreValues || []).map(v => this.fb.control(v))),
      certifications: this.fb.array((data.certifications || []).map(c => this.fb.control(c))),

      languages: this.fb.array((data.languages || []).map(l => this.fb.group({
        name: [l.name || ''],
        level: [l.level || ''],
        percentage: [l.percentage || 0]
      }))),

      experience: this.fb.array((data.experience || []).map(e => this.fb.group({
        id: [e.id || Date.now().toString()],
        role: [e.role || ''],
        company: [e.company || ''],
        period: [e.period || ''],
        subtitle: [e.subtitle || ''],
        achievements: this.fb.array((e.achievements || []).map((a: string) => this.fb.control(a)))
      }))),

      education: this.fb.array((data.education || []).map(e => this.fb.group({
        id: [e.id || Date.now().toString()],
        degree: [e.degree || ''],
        institution: [e.institution || ''],
        period: [e.period || ''],
        note: [e.note || ''],
        noteType: [e.noteType || '']
      })))
    });
  }

  // Helpers to add array items
  addStringItem(arr: FormArray) { arr.push(this.fb.control('')); }
  removeStringItem(arr: FormArray, index: number) { arr.removeAt(index); }

  addCustomField() {
    this.customFields.push(this.fb.group({ label: [''], value: [''], link: [''] }));
  }
  removeCustomField(index: number) { this.customFields.removeAt(index); }

  addLanguage() {
    this.languages.push(this.fb.group({ name: [''], level: [''], percentage: [0] }));
  }
  removeLanguage(index: number) { this.languages.removeAt(index); }

  // Experience Helpers
  addExperience() {
    this.experience.push(this.fb.group({
      id: [Date.now().toString()],
      role: [''],
      company: [''],
      period: [''],
      subtitle: [''],
      achievements: this.fb.array([this.fb.control('')])
    }));
  }
  removeExperience(index: number) { this.experience.removeAt(index); }

  getAchievements(expIndex: number) {
    return this.experience.at(expIndex).get('achievements') as FormArray;
  }
  addAchievement(expIndex: number) {
    this.getAchievements(expIndex).push(this.fb.control(''));
  }
  removeAchievement(expIndex: number, achIndex: number) {
    this.getAchievements(expIndex).removeAt(achIndex);
  }

  // Education Helpers
  addEducation() {
    this.education.push(this.fb.group({
      id: [Date.now().toString()],
      degree: [''],
      institution: [''],
      period: [''],
      note: [''],
      noteType: ['']
    }));
  }
  removeEducation(index: number) { this.education.removeAt(index); }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.cvForm.get('profile.photoPath')?.setValue(reader.result as string);
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.cvForm.invalid || !this.cvId) return;
    this.saving = true;
    this.cdr.markForCheck();

    this.cvService.updateCv(this.cvId, this.cvLabel, this.cvForm.value).subscribe({
      next: () => {
        this.saving = false;
        this.cdr.markForCheck();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Save failed', err);
        this.saving = false;
        this.cdr.markForCheck();
        this.toastService.show('Failed to save CV', 'error');
      }
    });
  }

  tailorWithAi() {
    if (!this.cvId) return;
    if (!this.aiJobDescription && !this.aiJobUrl) {
      this.toastService.show('Please provide a job description or a URL.', 'error');
      return;
    }

    this.aiLoading = true;
    this.cdr.markForCheck();

    this.cvService.tailorCv(this.cvId, this.aiJobDescription, this.aiJobUrl).subscribe({
      next: (tailoredData) => {
        this.initForm(tailoredData);
        this.aiLoading = false;
        this.showAiPanel = false;
        this.cdr.markForCheck();
        this.toastService.show('✨ CV tailored successfully! Please review the changes.', 'success');
      },
      error: (err) => {
        console.error('AI tailoring failed', err);
        this.aiLoading = false;
        this.cdr.markForCheck();
        this.toastService.show('Failed to tailor CV: ' + (err.error?.error || 'Unknown error'), 'error');
      }
    });
  }
}
