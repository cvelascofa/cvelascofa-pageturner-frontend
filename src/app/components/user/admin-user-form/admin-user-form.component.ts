import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../models/user/user.model';
import { AuthService } from '../../../_service/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Role } from '../../../models/role/role.model';
import { RoleService } from '../../../_service/role/role.service';

@Component({
  selector: 'app-admin-user-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-form.component.html',
  styleUrl: './admin-user-form.component.css'
})

export class AdminUserFormComponent {

  isVisible: boolean = false;
  isEditMode: boolean = false;

  roles: Role[] = [];

  @Input() user: User = {
    id: 0,
    username: '',
    email: '',
    role: {
      id: 0,
      name: '',
      description: ''
    },
  };

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<User>();

  constructor(
    private userService: AuthService,
    private roleService: RoleService
  ) { }

  openModal(user: User): void {
    this.user = { ...user };
    this.isEditMode = user.id !== 0;
    this.isVisible = true;
    document.body.classList.add('modal-open');
    this.loadRoles();
  }

  closeModal(): void {
    this.isVisible = false;
    document.body.classList.remove('modal-open');
  }

  onSubmit(): void {
    this.isEditMode ? this.update() : this.create();
  }

  update(): void {
    this.userService.update(this.user).subscribe({
      next: (updatedUser) => {
        this.confirm.emit(updatedUser);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }

  create(): void {
    this.userService.registerAdmin(this.user.username, this.user.email, this.user.password).subscribe({
      next: (newUser) => {
        this.confirm.emit(newUser);
        this.closeModal();
      },

      error: (err) => {
        console.error('Error creating user:', err);
      }
    });
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
  
        const matchingRole = this.roles.find(r => r.id === this.user.role?.id);
        if (matchingRole) {
          this.user.role = matchingRole;
        } else {
          this.user.role = { id: 0, name: '', description: '' };
        }
      },
      error: (err) => {
        console.error('Error loading roles:', err);
      }
    });
  }
  
}