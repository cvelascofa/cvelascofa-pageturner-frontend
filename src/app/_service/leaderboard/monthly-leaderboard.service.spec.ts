import { TestBed } from '@angular/core/testing';

import { MonthlyLeaderboardService } from './monthly-leaderboard.service';

describe('MonthlyLeaderboardService', () => {
  let service: MonthlyLeaderboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthlyLeaderboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
