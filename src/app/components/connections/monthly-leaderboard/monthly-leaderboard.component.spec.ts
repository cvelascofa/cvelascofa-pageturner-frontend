import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyLeaderboardComponent } from './monthly-leaderboard.component';

describe('MonthlyLeaderboardComponent', () => {
  let component: MonthlyLeaderboardComponent;
  let fixture: ComponentFixture<MonthlyLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyLeaderboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
