import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { EditionType } from '../../../models/edition-type/edition-type.model';
import { EditionTypeService } from '../../../_service/edition-type/edition-type.service';

@Component({
  selector: 'app-edition-type-list',
  imports: [CommonModule, PaginationComponent],
  templateUrl: './edition-type-list.component.html',
  styleUrl: './edition-type-list.component.css'
})
export class EditionTypeListComponent {
  // Search
  searchQuery: string = '';

  // Pagination
  pageSize: number = 10;
  currentPage: number = 0;
  totalPages: number = 0;
  editionTypes: any[] = [];

  // Delete modal
  editionTypeToDelete: number | null = null; 
  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  // Update modal
  showFormModal = false;
  editionTypeToUpdate: EditionType = { id: 0, name: '' };
  //@ViewChild(EditionTypeFormComponent) formModal!: EditionTypeFormComponent;

  constructor(
    private editionTypeService: EditionTypeService
  ) {}

  ngOnInit(): void {
    this.getAllEditionTypes();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllEditionTypes(page);
  }

  getAllEditionTypes(page: number = 0) {
    this.editionTypeService.getAllSearchPaginated(this.searchQuery, page, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.content && response.totalPages !== undefined) {
          this.editionTypes = response.content;
          this.totalPages = response.totalPages;
        }
      },
      error: (err) => {
        console.error('Error fetching edition types:', err);
      },
    });
  }

}
