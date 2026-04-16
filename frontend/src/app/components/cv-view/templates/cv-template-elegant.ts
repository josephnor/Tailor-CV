import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvData } from '../../../services/cv';
import { MarkdownPipe } from '../../../pipes/markdown-pipe';

@Component({
  selector: 'app-cv-template-elegant',
  standalone: true,
  imports: [CommonModule, MarkdownPipe],
  templateUrl: './cv-template-elegant.html',
})
export class CvTemplateElegant {
  @Input({ required: true }) data!: CvData;
}
