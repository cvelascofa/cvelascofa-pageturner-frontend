import { Component, OnInit, ViewChild } from '@angular/core';
import { Friend } from '../../../models/friend/friend.model';
import { FriendService } from '../../../_service/friend/friend.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/modal/modal.component';
import { RouterLink } from '@angular/router';
import { MonthlyLeaderboardComponent } from '../monthly-leaderboard/monthly-leaderboard.component';

@Component({
  selector: 'app-friend-list',
  imports: [CommonModule, ModalComponent, RouterLink, MonthlyLeaderboardComponent],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.css'
})
export class FriendListComponent implements OnInit {

  acceptedFriends: Friend[] = [];
  errorMessage: string = '';
  acceptedLoaded: boolean = false;
  currentUserId: number = 1;

  @ViewChild('deleteModal') deleteModal!: ModalComponent;
  friendToRemove: Friend | null = null;

  constructor(private friendService: FriendService) { }

  ngOnInit(): void {
    this.loadAcceptedFriends();
  }

  loadAcceptedFriends(): void {
    this.friendService.getAcceptedFriends().subscribe({
      next: (friends) => {
        this.acceptedFriends = friends;
        this.acceptedLoaded = true;
      },
      error: (err) => {
        console.error('Error loading accepted friends:', err);
        this.errorMessage = 'Error loading accepted friends';
        this.acceptedLoaded = true;
      }
    });
  }

  confirmRemove(friend: Friend): void {
    this.friendToRemove = friend;
    this.deleteModal.title = 'Confirm Delete';
    this.deleteModal.message = `Are you sure you want to delete your friend connection with ${
      friend.senderId === this.currentUserId ? friend.recipientUsername : friend.senderUsername
    }?`;
    this.deleteModal.confirmButtonText = 'Delete';
    this.deleteModal.cancelButtonText = 'Cancel';
    this.deleteModal.type = 'danger';
    this.deleteModal.openModal();
  }

  onConfirmRemove(): void {
    if (!this.friendToRemove) return;

    this.friendService.rejectFriendRequest(this.friendToRemove.senderId, this.friendToRemove.recipientId).subscribe({
      next: () => {
        this.loadAcceptedFriends();
        this.friendToRemove = null;
      },
      error: (err) => {
        console.error('Error removing friend request:', err);
        this.errorMessage = 'Error removing friend request';
      }
    });
  }

  onCancelRemove(): void {
    this.friendToRemove = null;
  }

}