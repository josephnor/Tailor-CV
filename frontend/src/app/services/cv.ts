import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CvProfile {
  firstName: string;
  lastName: string;
  subtitle: string;
  photoPath: string;
  summary: string;
  quote: string;
}

export interface CvContact {
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  linkedinUrl: string;
  customFields?: CvCustomField[];
}

export interface CvCustomField {
  label: string;
  value: string;
  link?: string;
}

export interface CvLanguage {
  name: string;
  level: string;
  percentage: number;
}

export interface CvExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  subtitle: string;
  achievements: string[];
}

export interface CvEducation {
  id: string;
  degree: string;
  institution: string;
  period: string;
  note: string;
  noteType: string;
}

export interface CvData {
  cvId?: string;
  label?: string;
  profile: CvProfile;
  contact: CvContact;
  skills: string[];
  languages: CvLanguage[];
  experience: CvExperience[];
  education: CvEducation[];
  coreValues: string[];
  certifications: string[];
}

export interface CvListItem {
  cvId: string;
  label: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class CvService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cv`;

  listCvs(username: string): Observable<CvListItem[]> {
    return this.http.get<CvListItem[]>(`${this.apiUrl}/${username}`);
  }

  getDefaultCv(username: string): Observable<CvData> {
    return this.http.get<CvData>(`${this.apiUrl}/${username}/default`);
  }

  getCv(username: string, cvId: string): Observable<CvData> {
    return this.http.get<CvData>(`${this.apiUrl}/${username}/${cvId}`);
  }

  createCv(label: string, data?: CvData): Observable<{ success: boolean; cvId: string }> {
    return this.http.post<{ success: boolean; cvId: string }>(this.apiUrl, { label, data });
  }

  updateCv(cvId: string, label: string, data: CvData): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.apiUrl}/${cvId}`, { label, data });
  }

  deleteCv(cvId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${cvId}`);
  }

  duplicateCv(cvId: string, label?: string): Observable<{ success: boolean; cvId: string }> {
    return this.http.post<{ success: boolean; cvId: string }>(`${this.apiUrl}/${cvId}/duplicate`, { label });
  }

  setDefault(cvId: string): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.apiUrl}/${cvId}/default`, {});
  }

  tailorCv(cvId: string, jobDescription: string, jobUrl: string): Observable<CvData> {
    return this.http.post<CvData>(`${environment.apiUrl}/ai/tailor`, { cvId, jobDescription, jobUrl });
  }
}
