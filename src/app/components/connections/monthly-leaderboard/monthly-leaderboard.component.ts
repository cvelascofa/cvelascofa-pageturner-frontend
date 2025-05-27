import { Component, OnInit } from '@angular/core';
import { MonthlyLeaderboardService } from '../../../_service/leaderboard/monthly-leaderboard.service';
import { UserService } from '../../../_service/user/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TokenStorageService } from '../../../_service/token-storage/token-storage.service';

@Component({
  selector: 'app-monthly-leaderboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './monthly-leaderboard.component.html',
  styleUrl: './monthly-leaderboard.component.css'
})
export class MonthlyLeaderboardComponent implements OnInit {

  leaderboard: any[] = [];
  currentUserId?: number;

  constructor(
    private leaderboardService: MonthlyLeaderboardService,
    private userService: UserService,
    private tokenStorageService: TokenStorageService
  ) { }


  ngOnInit(): void {
    const user = this.tokenStorageService.getUser();
    if (user && user.id) {
      this.currentUserId = user.id;
    }

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    this.leaderboardService.getByMonthAndYear(month, year).subscribe(data => {
      const leaderboardWithUsers = data.map((entry: any) => ({
        ...entry,
        userData: null
      }));

      this.leaderboard = leaderboardWithUsers;

      leaderboardWithUsers.forEach((entry, index) => {
        if (entry.userId) {
          this.userService.getUserById(entry.userId).subscribe(userData => {
            this.leaderboard[index].userData = userData;
          });
        }
      });
    });
  }

  getMedalEmoji(index: number): string | null {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return null;
    }
  }

}