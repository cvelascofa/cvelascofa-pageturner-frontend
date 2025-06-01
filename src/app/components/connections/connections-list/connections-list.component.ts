import { Component, ViewChild } from '@angular/core';
import { AddFriendListComponent } from '../../user/add-friend-list/add-friend-list.component';
import { FriendRequestListComponent } from '../friend-request-list/friend-request-list.component';
import { CommonModule } from '@angular/common';
import { FriendListComponent } from '../friend-list/friend-list.component';
import { MonthlyLeaderboardComponent } from '../monthly-leaderboard/monthly-leaderboard.component';

@Component({
  selector: 'app-connections-list',
  imports: [AddFriendListComponent, FriendRequestListComponent, CommonModule, FriendListComponent, MonthlyLeaderboardComponent],
  templateUrl: './connections-list.component.html',
  styleUrl: './connections-list.component.css'
})
export class ConnectionsListComponent {

  @ViewChild(FriendRequestListComponent) friendRequestList!: FriendRequestListComponent;
  @ViewChild(FriendListComponent) friendList!: FriendListComponent;
  @ViewChild(AddFriendListComponent) addFriendList!: AddFriendListComponent;

  ngAfterViewInit() {
    const tabs = document.querySelectorAll('a[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
      tab.addEventListener('shown.bs.tab', (event: any) => {
        const activatedTabId = event.target.getAttribute('href');

        if (activatedTabId === '#tab1') {
          this.friendRequestList.loadReceivedRequests();
          this.friendRequestList.loadSentRequests();
        } else if (activatedTabId === '#tab2') {
          this.friendList.loadAcceptedFriends();
        } else if (activatedTabId === '#tab3') {
          this.addFriendList.refresh();
        }
      });
    });
  }

}