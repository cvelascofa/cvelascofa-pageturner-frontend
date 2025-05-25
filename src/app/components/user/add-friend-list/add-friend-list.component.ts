import { Component, ViewChild } from '@angular/core';
import { UserService } from '../../../_service/user/user.service';
import { CommonModule } from '@angular/common';
import { AdminUserSearchComponent } from '../admin-user-search/admin-user-search.component';
import { Friend } from '../../../models/friend/friend.model';
import { TokenStorageService } from '../../../_service/token-storage/token-storage.service';
import { FriendService } from '../../../_service/friend/friend.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-friend-list',
  imports: [CommonModule, AdminUserSearchComponent, ModalComponent, RouterLink],
  templateUrl: './add-friend-list.component.html',
  styleUrl: './add-friend-list.component.css'
})
export class AddFriendListComponent {

  users: any[] = [];
  recipientUser: any = null;
  friends: Friend[] = [];
  currentUserId!: number;

  @ViewChild('confirmModal') confirmModal!: ModalComponent;

  friendRequestToSend: Friend | null = null;

  constructor(
    private userService: UserService,
    private tokenService: TokenStorageService,
    private friendService: FriendService
  ) {}


ngOnInit() {
  const currentUser = this.tokenService.getUser();
  this.currentUserId = currentUser.id;

  this.loadFriends();
}

  loadFriends(): void {
    this.friendService.getAllRelationsByUserId(this.currentUserId).subscribe({
      next: (friends) => {
        this.friends = friends;
      },
      error: (err) => {
        console.error('Error loading friends:', err);
      }
    });
  }

  hasRelationWithUser(userId: number): boolean {
    return this.friends.some(f =>
      (f.senderId === this.currentUserId && f.recipientId === userId) ||
      (f.recipientId === this.currentUserId && f.senderId === userId)
    );
  }

  onSearch(query: { username: string }) {
    this.userService.getSearchCandidates(query.username).subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  openSendFriendRequestModal(recipientId: number): void {
    this.confirmModal.title = 'Loading...';
    this.confirmModal.message = 'Fetching user info, please wait...';
    this.confirmModal.confirmButtonText = '';
    this.confirmModal.cancelButtonText = 'Cancel';
    this.confirmModal.type = 'info';
    this.confirmModal.openModal();

    const currentUser = this.tokenService.getUser();
  
    this.userService.getUserById(recipientId).subscribe({
      next: (recipient) => {
        this.recipientUser = recipient;
  
        const friend: Friend = {

          senderId: currentUser.id,
          recipientId: recipient.id,
          senderEmail: currentUser.email,
          senderUsername: currentUser.username,
          recipientEmail: recipient.email,
          recipientUsername: recipient.username,
          friendStatus: 'PENDING'

        };
  
        this.friendRequestToSend = friend;
        this.prepareSendFriendRequestConfirmation(friend);
      },
      error: (err) => {
        console.error('Error fetching recipient user:', err);
      }
    });
  }

  prepareSendFriendRequestConfirmation(friend: Friend): void {
    this.confirmModal.title = 'Send Friend Request';
    this.confirmModal.message = `Are you sure you want to send a friend request to ${friend.recipientUsername}?`;
    this.confirmModal.confirmButtonText = 'Send Request';
    this.confirmModal.cancelButtonText = 'Cancel';
    this.confirmModal.type = 'info';
  }

  onConfirmSendFriendRequest(): void {
    if (this.friendRequestToSend) {
      this.friendService.sendFriendRequest(this.friendRequestToSend).subscribe({
        next: () => {
          this.confirmModal.closeModal();
          this.loadFriends();
        },
        error: (err) => {
          console.error('Error sending friend request:', err);
          this.confirmModal.closeModal();
        }
      });
    }
  }

  onCancelSendFriendRequest(): void {
    this.confirmModal.closeModal();
  }

  public refresh(): void {
    this.loadFriends();
    this.users = [];
  }

}