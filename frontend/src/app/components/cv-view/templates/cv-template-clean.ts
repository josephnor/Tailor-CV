import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvData } from '../../../services/cv';
import { MarkdownPipe } from '../../../pipes/markdown-pipe';

@Component({
  selector: 'app-cv-template-clean',
  standalone: true,
  imports: [CommonModule, MarkdownPipe],
  templateUrl: './cv-template-clean.html',
})
export class CvTemplateClean {
  @Input({ required: true }) data!: CvData;
}
