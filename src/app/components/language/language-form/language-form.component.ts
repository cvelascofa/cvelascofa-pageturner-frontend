import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Language } from '../../../models/language/language.model';
import { LanguageService } from '../../../_service/language/language.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-language-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './language-form.component.html',
  styleUrl: './language-form.component.css'
})

export class LanguageFormComponent {
  
  isVisible: boolean = false;
  isEditMode: boolean = false;

  @Input() language: Language = { id: 0, name: '', code: '' };
  
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Language>();

  constructor(private languageService: LanguageService) { }

  openModal(language: Language): void {
    this.language = { ...language };
    this.isEditMode = language.id !== 0;
    this.isVisible = true;
    document.body.classList.add('modal-open');
  }
  
  closeModal(): void {
    this.isVisible = false;
    document.body.classList.remove('modal-open');
  }

  onSubmit(): void {
    this.isEditMode ? this.update() : this.create();
  }

  update() {
    this.languageService.update(this.language).subscribe({
      next: (updatedLanguage) => {
        this.confirm.emit(updatedLanguage);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating language: ', err);
      }
    })
  }

  create() {
    this.languageService.create(this.language).subscribe({
      next: (newLanguage) => {
        this.confirm.emit(newLanguage);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating language: ', err);
      }
    });
  }
}