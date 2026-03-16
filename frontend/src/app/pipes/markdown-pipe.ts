import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';
    // Replace **text** with <strong>text</strong>
    return value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}
