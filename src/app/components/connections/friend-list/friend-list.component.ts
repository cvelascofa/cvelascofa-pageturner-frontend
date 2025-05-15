import { Component, OnInit } from '@angular/core';
import { Friend } from '../../../models/friend/friend.model';
import { FriendService } from '../../../_service/friend/friend.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-friend-list',
  imports: [CommonModule],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.css'
})
export class FriendListComponent implements OnInit {

  acceptedFriends: Friend[] = [];
  errorMessage: string = '';
  acceptedLoaded: boolean = false;
  currentUserId: number = 1;

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

  removeRequest(senderId: number, recipientId: number, isReceived: boolean): void {
    this.friendService.rejectFriendRequest(senderId, recipientId).subscribe({
      next: () => {
        this.loadAcceptedFriends();
      },
      error: (err) => {
        console.error('Error removing friend request:', err);
        this.errorMessage = 'Error removing friend request';
      }
    });
  }
}