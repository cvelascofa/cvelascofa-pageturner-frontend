import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../../../_service/challenge/challenge.service';
import { Challenge } from '../../../models/challenge/challenge.model';
import { CommonModule } from '@angular/common';
import { UserStatistics } from '../../../models/user/user-statistics.model';
import { UserStatisticsService } from '../../../_service/user-statistics/user-statistics.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../models/user/user.model';
import { UserService } from '../../../_service/user/user.service';
import { UserChallengeService } from '../../../_service/challenge/user-challenge.service';

@Component({
  selector: 'app-challenge-list',
  imports: [CommonModule],
  templateUrl: './challenge-list.component.html',
  styleUrl: './challenge-list.component.css'
})
export class ChallengeListComponent implements OnInit {

  challengesByCategory: { [category: string]: Challenge[] } = {};
  groupedCategories: { category: string, challenges: Challenge[] }[] = [];
  userId!: number;
  user!: User;
  userStats!: UserStatistics;
  rankCompletionCache: { [challengeId: number]: boolean } = {};

  constructor(
    private challengeService: ChallengeService,
    private userStatsService: UserStatisticsService,
    private route: ActivatedRoute,
    private userService: UserService,
    private userChallengeService: UserChallengeService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.userId = +idParam;
        this.userService.getUserById(this.userId).subscribe(user => {
          this.user = user;
        });

        this.userStatsService.getStatisticsByUserId(this.userId).subscribe(stats => {
          this.userStats = stats;
          console.log(this.userStats)
          this.loadChallenges();
        });
      } else {
        this.loadChallenges();
      }
    });
  }

  private loadChallenges(): void {
    this.challengeService.getAll().subscribe(challenges => {
      const grouped = this.groupByCategory(challenges);
      console.log(challenges)
      this.groupedCategories = this.chunkCategories(grouped, 3);
    });
  }

  private groupByCategory(challenges: Challenge[]): { [category: string]: Challenge[] } {
    return challenges.reduce((groups, challenge) => {
      const category = challenge.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(challenge);
      return groups;
    }, {} as { [category: string]: Challenge[] });
  }

  private chunkCategories(grouped: { [category: string]: Challenge[] }, chunkSize: number): { category: string, challenges: Challenge[] }[] {
    const result: { category: string, challenges: Challenge[] }[] = [];
    for (const category in grouped) {
      const challenges = grouped[category];
      for (let i = 0; i < challenges.length; i += chunkSize) {
        result.push({
          category: category,
          challenges: challenges.slice(i, i + chunkSize)
        });
      }
    }
    return result;
  }

  getUserProgressValue(challenge: Challenge): number {
    if (!this.userStats) return 0;

    const name = challenge.name.toLowerCase();
    const max = challenge.targetQuantity || 1;


    if (name.includes('rank')) {
      const cached = this.rankCompletionCache[challenge.id];
      if (cached !== undefined) {
        return cached ? max : 0;
      } else {
        this.userChallengeService.hasUserCompletedChallenge(this.userId, challenge.id).subscribe(completed => {
          this.rankCompletionCache[challenge.id] = completed;
        });
        return 0;
      }
    }


    let value = 0;

    if (name.includes('book')) {
      value = this.userStats.totalBooksRead;
    } else if (name.includes('page')) {
      value = this.userStats.totalPagesRead;
    } else if (name.includes('rating')) {
      value = this.userStats.totalRatings;
    }

    return Math.min(value, max);
  }

  getChallengeProgress(challenge: Challenge): number {
    const current = this.getUserProgressValue(challenge);
    const total = challenge.targetQuantity || 1;
    return Math.min(100, (current / total) * 100);
  }

}