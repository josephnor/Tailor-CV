import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvData } from '../../../services/cv';
import { MarkdownPipe } from '../../../pipes/markdown-pipe';

@Component({
  selector: 'app-cv-template-bold',
  standalone: true,
  imports: [CommonModule, MarkdownPipe],
  templateUrl: './cv-template-bold.html',
})
export class CvTemplateBold {
  @Input({ required: true }) data!: CvData;
}
