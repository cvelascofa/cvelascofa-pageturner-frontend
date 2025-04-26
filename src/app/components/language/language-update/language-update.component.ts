import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Language } from '../../../models/language/language.model';
import { LanguageService } from '../../../_service/language/language.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-language-update',
  imports: [FormsModule, CommonModule],
  templateUrl: './language-update.component.html',
  styleUrl: './language-update.component.css'
})
export class LanguageUpdateComponent {
  isVisible = false;
  @Input() language: Language = { id: 0, name: '', code: '' };
  
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Language>();

  constructor(private languageService: LanguageService) { }

  openModal(language: Language): void {
    this.language = { ...language };
    this.isVisible = true;
    document.body.classList.add('modal-open');
  }
  
  closeModal(): void {
    this.isVisible = false;
    document.body.classList.remove('modal-open');
  }

  onUpdate(): void {
    this.languageService.update(this.language).subscribe({
      next: (updatedlanguage) => {
        this.confirm.emit(updatedlanguage);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating language:', err);
      }
    });
  }

}