import { Component, OnInit } from '@angular/core';
import { FriendService } from '../../../_service/friend/friend.service';
import { Friend } from '../../../models/friend/friend.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-friend-request-list',
  imports: [CommonModule],
  templateUrl: './friend-request-list.component.html',
  styleUrl: './friend-request-list.component.css'
})
export class FriendRequestListComponent implements OnInit {

  receivedRequests: Friend[] = [];
  sentRequests: Friend[] = [];

  receivedLoaded = false;
  sentLoaded = false;

  constructor(private friendService: FriendService) {}

  ngOnInit(): void {
    this.loadReceivedRequests();
    this.loadSentRequests();
  }

  loadReceivedRequests(): void {
    this.friendService.getReceivedRequests().subscribe(
      (requests: Friend[]) => {
        this.receivedRequests = requests;
        console.log(this.receivedRequests)
        this.receivedLoaded = true;
      },
      (error) => {
        console.error('Error al cargar solicitudes recibidas:', error);
        this.receivedRequests = [];
      }
    );
  }

  loadSentRequests(): void {
    this.friendService.getSentRequests().subscribe(
      (requests: Friend[]) => {
        this.sentRequests = requests;
        console.log(this.sentRequests)
        this.sentLoaded = true;
      },
      (error) => {
        console.error('Error al cargar solicitudes enviadas:', error);
        this.sentRequests = [];
      }
    );
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

}