import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../_service/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-user-detail',
  imports: [CommonModule],
  templateUrl: './public-user-detail.component.html',
  styleUrl: './public-user-detail.component.css'
})
export class PublicUserDetailComponent implements OnInit {

  
  defaultAvatar = 'https://ui-avatars.com/api/?background=random&name=';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.loadUser(id);
    }
  }

  loadUser(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        //this.user = data;
        // Generamos la URL avatar por defecto con el username si no tiene avatarUrl
        if (!this.user.avatarUrl) {
          // Codificamos el username para URL
          const nameForAvatar = encodeURIComponent(this.user.username || 'Usuario Anónimo');
          console.log(nameForAvatar)
          this.user.avatarUrl = `${this.defaultAvatar}${nameForAvatar}`;
          console.log(this.user.avatarUrl)
        }
      },
      error: (err) => {
        console.error('Error loading user:', err);
      }
    });
  }

  user = {
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

  books = [
    {
      id: 1,
      title: 'The Hobbit',
      coverImage: 'https://covers.openlibrary.org/b/id/6979861-L.jpg',
      author: 'J.R.R. Tolkien',
      pages: 310,
      rating: 4.7,
      finishedDate: new Date('2025-04-10')
    },
    {
      id: 2,
      title: '1984',
      coverImage: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
      author: 'George Orwell',
      pages: 328,
      rating: 4.5,
      finishedDate: new Date('2025-03-20')
    },
    {
      id: 3,
      title: 'Clean Code',
      coverImage: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
      author: 'Robert C. Martin',
      pages: 464,
      rating: 4.6,
      finishedDate: new Date('2025-01-15')
    }
  ];
  
  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'https://placehold.co/150x220?text=No+Cover';
  }

}
