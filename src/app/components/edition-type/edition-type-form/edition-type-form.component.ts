import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditionTypeService } from '../../../_service/edition-type/edition-type.service';
import { EditionType } from '../../../models/edition-type/edition-type.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edition-type-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './edition-type-form.component.html',
  styleUrl: './edition-type-form.component.css'
})
export class EditionTypeFormComponent {

  isVisible: boolean = false;
  isEditMode: boolean = false;

  @Input() editionType: EditionType = { id: 0, name: '' };

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<EditionType>();

  constructor(private editionTypeService: EditionTypeService) { }

  openModal(editionType: EditionType): void {
    this.editionType = { ...editionType };
    this.isEditMode = editionType.id !== 0;
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
    this.editionTypeService.update(this.editionType).subscribe({
      next: (updatedEditionType) => {
        this.confirm.emit(updatedEditionType);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating edition type:', err);
      }
    });
  }

  create(): void {
    this.editionTypeService.create(this.editionType).subscribe({
      next: (newEditionType) => {
        this.confirm.emit(newEditionType);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating edition type:', err);
      }
    });
  }
}
