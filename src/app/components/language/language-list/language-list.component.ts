import { Component, ViewChild } from '@angular/core';
import { LanguageService } from '../../../_service/language/language.service';
import { Language } from '../../../models/language/language.model';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/modal/modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { LanguageUpdateComponent } from '../language-update/language-update.component';

@Component({
  selector: 'app-language-list',
  imports: [CommonModule, ModalComponent, PaginationComponent, LanguageUpdateComponent],
  templateUrl: './language-list.component.html',
  styleUrl: './language-list.component.css'
})
export class LanguageListComponent {
  languages: any[] = [];

  // Pagination
  searchQuery: string = '';
  pageSize: number = 10;
  currentPage: number = 0;
  totalPages: number = 0;

   // Delete modal
  languageToDelete: number | null = null; 
  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  // Update mdoal
  showUpdateModal = false;
  languageToUpdate:  Language = { id: 0, name: '', code: '' };
  @ViewChild(LanguageUpdateComponent) updateModal!: LanguageUpdateComponent;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.getAllLanguages();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllLanguages(page);
  }

  getAllLanguages(page: number = 0): void {
    this.languageService.getAllSearchPaginated(this.searchQuery, page, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.content && response.totalPages !== undefined) {
          this.languages = response.content;
          this.totalPages = response.totalPages;
        }
      },
      error: (err) => {
        console.error('Error fetching languages:', err);
      }
    });
  }

  prepareDeleteConfirmation(id: number): void {
    this.languageToDelete = id;
    this.deleteModal.title = 'Delete Language';
    this.deleteModal.message = 'Are you sure you want to delete this language?';
    this.deleteModal.confirmButtonText = 'Delete';
    this.deleteModal.cancelButtonText = 'Cancel';
    this.deleteModal.type = 'danger';
  }

  prepareDeleteSuccess() {
    this.deleteModal.title = 'Language Deleted';
    this.deleteModal.message = 'The language has been successfully deleted.';
    this.deleteModal.type = 'info';
    this.deleteModal.confirmButtonText = '';
    this.deleteModal.cancelButtonText = 'Accept';
  }

  prepareDeleteError(err: HttpErrorResponse): void {
    if (err.status === 409) {
      this.deleteModal.message = 'This language cannot be deleted because it is still referenced.';
    } else if (err.status === 404) {
      this.deleteModal.message = 'Language not found.';
    } else {
      this.deleteModal.message = 'Something went wrong. Please try again.';
    }
  
    this.deleteModal.title = 'Error';
    this.deleteModal.type = 'info';
    this.deleteModal.confirmButtonText = '';
    this.deleteModal.cancelButtonText = 'Accept';
  }

  openDeleteModal(id: number) {
    this.prepareDeleteConfirmation(id);
    this.deleteModal.openModal();
  }

  delete(id: number): void {
    this.languageService.delete(id).subscribe({
      next: () => {
        this.languages = this.languages.filter(g => g.id !== id);
        this.deleteModal.closeModal();
        this.prepareDeleteSuccess();
        this.deleteModal.openModal();
      },
      error: (err: HttpErrorResponse) => {
        this.prepareDeleteError(err);
        this.deleteModal.openModal();
      }
    });
  }

  onConfirmDelete(): void {
    if (this.languageToDelete !== null) {
      this.delete(this.languageToDelete);
    }
  }

  openEditModal(language: Language): void {
    this.languageToUpdate = { ...language };
    this.showUpdateModal = true;
    this.updateModal.openModal(this.languageToUpdate);
  }

  onConfirmUpdate(updatedLanguage: Language): void {
    const index = this.languages.findIndex(g => g.id === updatedLanguage.id);
    if (index !== -1) {
      this.languages[index] = updatedLanguage;
    }
    this.updateModal.closeModal();
  }
  
}