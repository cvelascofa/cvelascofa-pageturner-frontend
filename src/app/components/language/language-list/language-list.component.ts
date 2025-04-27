import { Component, ViewChild } from '@angular/core';
import { LanguageService } from '../../../_service/language/language.service';
import { Language } from '../../../models/language/language.model';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/modal/modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { LanguageFormComponent } from '../language-form/language-form.component';
import { LanguageSearchComponent } from '../language-search/language-search.component';

@Component({
  selector: 'app-language-list',
  imports: [CommonModule, ModalComponent, PaginationComponent, LanguageFormComponent, LanguageSearchComponent],
  templateUrl: './language-list.component.html',
  styleUrl: './language-list.component.css'
})
export class LanguageListComponent {
  
  // Search
  searchQuery: string = '';
  
  // Pagination
  pageSize: number = 10;
  currentPage: number = 0;
  totalPages: number = 0;
  languages: any[] = [];

  // Delete modal
  languageToDelete: number | null = null; 
  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  // Form modal
  showFormModal = false;
  languageToUpdate:  Language = { id: 0, name: '', code: '' };
  @ViewChild(LanguageFormComponent) formModal!: LanguageFormComponent;

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
      this.languages = this.languages.filter(language => language.id !== id);
      if (this.languages.length < this.pageSize) {
        if (this.currentPage < this.totalPages - 1) {
          this.getAllLanguages(this.currentPage + 1);
        } else {
          if (this.currentPage > 0) {
            this.currentPage--;
            this.getAllLanguages(this.currentPage);
          }
        }
      } else {
        this.getAllLanguages(this.currentPage);
      }
      this.deleteModal.closeModal();
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

  openCreateModal(): void {
    this.openFormModal({ id: 0, name: '', code: '' });
  }
  
  openEditModal(language: Language): void {
    this.openFormModal(language);
  }

  openFormModal(language: Language): void {
    this.languageToUpdate = { ...language };
    this.showFormModal = true;
    this.formModal.openModal(this.languageToUpdate);
  }

  onConfirmForm(updatedLanguage: Language): void {

    if (updatedLanguage.id == 0) {
      this.create(updatedLanguage);
    } else {
      this.udpate(updatedLanguage);
    }
  }
  
  udpate(updatedLanguage: Language): void {
    const index = this.languages.findIndex(g => g.id === updatedLanguage.id);
    if (index !== -1) {
      this.languages[index] = updatedLanguage;
    }
  }

  create(newLanguage: Language): void {
    this.languages.push(newLanguage);
  }


  onSearch(query: { [key: string]: string }) {
    this.searchQuery = query['name'] || '';
    this.currentPage = 0;
    this.getAllLanguages();
  }
  
  onClearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.getAllLanguages();
  }
}