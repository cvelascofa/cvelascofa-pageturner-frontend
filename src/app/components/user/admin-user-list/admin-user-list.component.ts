import { Component, ViewChild } from '@angular/core';
import { User } from '../../../models/user/user.model';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TokenStorageService } from '../../../_service/token-storage/token-storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminUserFormComponent } from '../admin-user-form/admin-user-form.component';
import { AdminUserSearchComponent } from '../admin-user-search/admin-user-search.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../_service/user/user.service';

@Component({
  selector: 'app-admin-user-list',
  imports: [AdminUserSearchComponent, AdminUserFormComponent, PaginationComponent, CommonModule],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.css'
})
export class AdminUserListComponent {
  isLoading: boolean = false;

  // Search
  searchQuery: string = '';

  // Pagination
  pageSize: number = 10;
  currentPage: number = 0;
  totalPages: number = 0;
  users: User[] = [];

  // Update modal
  showFormModal = false;
  userToUpdate: User = {
    id: 0,
    username: '',
    email: '',
    role: {
      id: 0,
      name: '',
      description: ''
    }
  };
  @ViewChild(AdminUserFormComponent) formModal!: AdminUserFormComponent;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllUsers(page);
  }

  onConfirmForm(updatedUser: User): void {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);

    if (index !== -1) {
      this.handleUpdate(updatedUser, index);
    } else {
      this.handleCreate(updatedUser);
    }

    this.formModal.closeModal();
  }

  handleUpdate(updatedUser: User, index: number): void {
    this.users[index] = updatedUser;
  }

  handleCreate(newUser: User): void {
    const isLastPage = this.currentPage === this.totalPages - 1;

    if (isLastPage) {
      if (this.users.length < this.pageSize) {
        this.users.push(newUser);
      } else {
        this.totalPages++;
      }
    } else {
      this.currentPage = 0;
      this.getAllUsers(0);
    }
  }

  onSearch(query: { [key: string]: string }) {
    this.searchQuery = query['name'] || '';
    this.currentPage = 0;
    this.getAllUsers();
  }

  onClearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.getAllUsers();
  }

  openCreateModal(): void {
    this.openFormModal({
      id: 0,
      username: '',
      email: '',
      role: {
        id: 0,
        name: '',
        description: ''
      }
    });
  }

  openEditModal(user: User): void {
    this.openFormModal(user);
  }

  openFormModal(user: User): void {
    this.userToUpdate = { ...user };
    this.showFormModal = true;
    this.formModal.openModal(this.userToUpdate);
  }

  getAllUsers(page: number = 0, callback?: (users: any[]) => void): void {
    this.isLoading = true;
  
    this.userService.getAllSearchPaginated(this.searchQuery, page, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.content && response.totalPages !== undefined) {
          this.users = response.content;
          this.totalPages = response.totalPages;
          this.currentPage = response.number;
          
          if (callback) {
            callback(this.users);
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.isLoading = false;
      }
    });
  }
  
}
