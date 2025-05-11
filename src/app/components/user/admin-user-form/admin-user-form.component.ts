import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../models/user/user.model';
import { AuthService } from '../../../_service/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-form.component.html',
  styleUrl: './admin-user-form.component.css'
})

export class AdminUserFormComponent {

  isVisible: boolean = false;
  isEditMode: boolean = false;

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

  constructor(private userService: AuthService) { }

  openModal(user: User): void {
    this.user = { ...user };
    this.isEditMode = user.id !== 0;
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
}
