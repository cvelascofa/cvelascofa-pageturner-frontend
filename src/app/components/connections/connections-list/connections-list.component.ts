import { Component } from '@angular/core';
import { AddFriendListComponent } from '../../user/add-friend-list/add-friend-list.component';
import { FriendRequestListComponent } from '../friend-request-list/friend-request-list.component';
import { CommonModule } from '@angular/common';
import { FriendListComponent } from '../friend-list/friend-list.component';

@Component({
  selector: 'app-connections-list',
  imports: [AddFriendListComponent, FriendRequestListComponent, CommonModule, FriendListComponent],
  templateUrl: './connections-list.component.html',
  styleUrl: './connections-list.component.css'
})
export class ConnectionsListComponent {

}
