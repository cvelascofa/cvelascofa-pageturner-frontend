import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../_service/user/user.service';
import { CommonModule } from '@angular/common';
import { UserStatisticsService } from '../../../_service/user-statistics/user-statistics.service';
import { UserStatistics } from '../../../models/user/user-statistics.model';
import { FavouriteService } from '../../../_service/favourite/favourite.service';
import { Favourite } from '../../../models/favourite/favourite.model';
import { forkJoin } from 'rxjs';
import { BookService } from '../../../_service/book/book.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { User } from '../../../models/user/user.model';


@Component({
  selector: 'app-public-user-detail',
  imports: [CommonModule, RouterModule, PaginationComponent],
  templateUrl: './public-user-detail.component.html',
  styleUrl: './public-user-detail.component.css'
})
export class PublicUserDetailComponent implements OnInit {

  defaultAvatar = 'https://ui-avatars.com/api/?background=random&name=';
  statistics?: UserStatistics;
  statisticsError: string | null = null;
  favouritesWithBooks: Array<Favourite & { book: any }> = [];
  favourites: Favourite[] = [];
  favouritesError: string | null = null;

  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  user: User;
  userAvatarUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private userStatisticsService: UserStatisticsService,
    private favouriteService: FavouriteService,
    private bookService: BookService,
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.loadUser(id);
      this.loadUserStatistics(id);
    }
  }

  loadUser(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data;
        this.userAvatarUrl = this.getAvatarUrl(this.user.username);
        this.loadFavourites();
      },
      error: (err) => {
        console.error('Error loading user:', err);
      }
    });
  }
  /*
    user = {
      id: 1,
      name: 'Marcos D.B',
      username: 'Marcos D.B',
      email: 'user123@example.com',
      avatarUrl: 'https://ui-avatars.com/api/?background=random&name=Marcos+D.B',
      totalBooksRead: 467,
      mostBooksInMonth: 10,
      longestReadingStreak: 9,
      currentReadingStreak: 1,
      totalPagesRead: 112348,
      totalReadingTime: '329:08:27 hrs',
      averageRating: 4.3,
      dailyReadingGoal: 30,
      monthlyBooksGoal: 3,
      currentGoalStreak: 14,
      device: 'Kindle Paperwhite',
      lastReadingSession: new Date('2025-05-16'),
      booksLastYear: 84,
      pagesLastYear: 12833,
      readingTimeLastYear: '107 hrs',
    };
  */

  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'https://placehold.co/150x220?text=No+Cover';
  }

  loadUserStatistics(id: number): void {
    this.userStatisticsService.getStatisticsByUserId(id).subscribe({
      next: (data) => {
        this.statistics = data;
        this.statisticsError = null;
      },
      error: () => {
        this.statisticsError = 'Failed to load user statistics. Please try again later.';
      }
    });
  }

  loadFavourites(): void {
    this.favouriteService.getAllByUserId(this.user.id).subscribe({
      next: (favs) => {
        this.favourites = favs;
        this.totalPages = Math.ceil(this.favourites.length / this.pageSize);
        this.loadPage(this.currentPage);
      },
      error: () => {
        this.favouritesWithBooks = [];
        this.totalPages = 0;
      }
    });
  }

  loadPage(page: number): void {
    this.currentPage = page;
    const pageFavourites = this.favourites.slice(page * this.pageSize, (page + 1) * this.pageSize);

    const bookObservables = pageFavourites.map(fav => this.bookService.getById(fav.bookId));
    forkJoin(bookObservables).subscribe({
      next: (books) => {
        this.favouritesWithBooks = pageFavourites.map((fav, i) => ({
          ...fav,
          book: books[i]
        }));
      },
      error: () => {
        this.favouritesWithBooks = [];
      }
    });
  }

  onPageChange(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.loadPage(newPage);
    }
  }


  getAvatarUrl(username: string): string {
    const encodedName = encodeURIComponent(username || 'Anonymous');
    return `https://ui-avatars.com/api/?background=random&name=${encodedName}`;
  }

}