import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Publisher } from '../../../models/publisher/publisher.model';
import { PublisherService } from '../../../_service/publisher/publisher.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publisher-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './publisher-form.component.html',
  styleUrl: './publisher-form.component.css'
})
export class PublisherFormComponent {
  isVisible: boolean = false;
  isEditMode: boolean = false;

  @Input() publisher: Publisher = { id: 0, name: '', website: '', country: '' };
  
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Publisher>();

  constructor(private publisherService: PublisherService) { }

  openModal(publisher: Publisher): void {
    this.publisher = { ...publisher };
    this.isEditMode = publisher.id !== 0;
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
    this.publisherService.update(this.publisher).subscribe({
      next: (updatedPublisher) => {
        this.confirm.emit(updatedPublisher);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating publisher: ', err);
      }
    })
  }

  create() {
    this.publisherService.create(this.publisher).subscribe({
      next: (newPublisher) => {
        this.confirm.emit(newPublisher);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating publisher: ', err);
      }
    });
  }

}