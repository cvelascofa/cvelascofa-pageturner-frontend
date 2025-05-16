import { Component, OnInit, ViewChild } from '@angular/core';
import { FriendService } from '../../../_service/friend/friend.service';
import { Friend } from '../../../models/friend/friend.model';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-friend-request-list',
  imports: [CommonModule, ModalComponent],
  templateUrl: './friend-request-list.component.html',
  styleUrl: './friend-request-list.component.css'
})
export class FriendRequestListComponent implements OnInit {

  receivedRequests: Friend[] = [];
  sentRequests: Friend[] = [];

  receivedLoaded = false;
  sentLoaded = false;

  @ViewChild('deleteModal') deleteModal!: ModalComponent;
  @ViewChild('acceptModal') acceptModal!: ModalComponent;

  requestToDelete: Friend | null = null;
  isDeleteFromReceived: boolean = false;
  
  requestToAccept: Friend | null = null;

  constructor(private friendService: FriendService) {}

  ngOnInit(): void {
    this.loadReceivedRequests();
    this.loadSentRequests();
  }

  loadReceivedRequests(): void {
    this.friendService.getReceivedRequests().subscribe(
      (requests: Friend[]) => {
        this.receivedRequests = requests;
        this.receivedLoaded = true;
      },
      (error) => {
        console.error(error);
        this.receivedRequests = [];
      }
    );
  }

  loadSentRequests(): void {
    this.friendService.getSentRequests().subscribe(
      (requests: Friend[]) => {
        this.sentRequests = requests;
        this.sentLoaded = true;
      },
      (error) => {
        console.error(error);
        this.sentRequests = [];
      }
    );
  }

  openAcceptModal(request: Friend): void {
    this.requestToAccept = request;

    this.acceptModal.title = 'Accept Friend Request';
    this.acceptModal.message = `Do you want to accept the friend request from ${request.senderUsername}?`;
    this.acceptModal.confirmButtonText = 'Accept';
    this.acceptModal.cancelButtonText = 'Cancel';
    this.acceptModal.type = 'info';
    this.acceptModal.openModal();
  }

  onConfirmAccept(): void {
    if (!this.requestToAccept) return;
  
    this.friendService.acceptFriendRequest(
      this.requestToAccept.senderId,
      this.requestToAccept.recipientId
    ).subscribe({
      next: () => {
        this.loadReceivedRequests();
        this.requestToAccept = null;
        this.acceptModal.closeModal();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onCancelAccept(): void {
    this.requestToAccept = null;
    this.acceptModal.closeModal();
  }

  openDeleteModal(request: Friend, isFromReceived: boolean): void {
    this.requestToDelete = request;
    this.isDeleteFromReceived = isFromReceived;

    const username = isFromReceived ? request.senderUsername : request.recipientUsername;

    this.deleteModal.title = 'Confirm Request Removal';
    this.deleteModal.message = `Are you sure you want to ${isFromReceived ? 'reject' : 'cancel'} the request with ${username}?`;
    this.deleteModal.confirmButtonText = isFromReceived ? 'Reject' : 'Delete';
    this.deleteModal.cancelButtonText = 'Cancel';
    this.deleteModal.type = 'danger';
    this.deleteModal.openModal();
  }

  onConfirmDelete(): void {
    if (!this.requestToDelete) return;
  
    this.friendService.rejectFriendRequest(
      this.requestToDelete.senderId,
      this.requestToDelete.recipientId
    ).subscribe({
      next: () => {
        this.isDeleteFromReceived ? this.loadReceivedRequests() : this.loadSentRequests();
        this.requestToDelete = null;
        this.deleteModal.closeModal();
      },
      error: (err) => {
        console.error('Failed to delete friend request:', err);
      }
    });
  }

  removeRequest(senderId: number, recipientId: number, isReceived: boolean): void {
    this.friendService.rejectFriendRequest(senderId, recipientId).subscribe({
      next: () => {
        if (isReceived) {
          this.loadReceivedRequests();
        } else {
          this.loadSentRequests();
        }
      },
      error: (err) => {
        console.error('Failed to remove friend request:', err);
      }
    });
  }  

  onCancelRemove(): void {
    this.requestToDelete = null;
    this.deleteModal.closeModal();
  }

  onConfirmRemove(): void {
    if (!this.requestToDelete) return;
  
    this.friendService.rejectFriendRequest(
      this.requestToDelete.senderId,
      this.requestToDelete.recipientId
    ).subscribe({
      next: () => {
        if (this.isDeleteFromReceived) {
          this.loadReceivedRequests();
        } else {
          this.loadSentRequests();
        }
        this.requestToDelete = null;
        this.deleteModal.closeModal();
      },
      error: (err) => {
        console.error('Failed to remove friend request:', err);
      }
    });
  }  

  confirmRemove(request: Friend, isReceived: boolean): void {
    this.requestToDelete = request;
    this.isDeleteFromReceived = isReceived;
  
    const username = isReceived ? request.senderUsername : request.recipientUsername;
  
    this.deleteModal.title = 'Confirm Request Removal';
    this.deleteModal.message = `Are you sure you want to ${isReceived ? 'reject' : 'cancel'} the request with ${username}?`;
    this.deleteModal.confirmButtonText = isReceived ? 'Reject' : 'Delete';
    this.deleteModal.cancelButtonText = 'Cancel';
    this.deleteModal.type = 'danger';
    this.deleteModal.openModal();
  }

  acceptRequest(senderId: number, recipientId: number): void {
    this.friendService.acceptFriendRequest(senderId, recipientId).subscribe({
      next: () => {
        this.loadReceivedRequests();
      },
      error: (err) => {
        console.error('Failed to accept friend request:', err);
      }
    });
  }  

}