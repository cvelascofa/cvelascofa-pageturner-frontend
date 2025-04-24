import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Genre } from '../../../models/genre/genre.model';
import { GenreService } from '../../../_service/genre/genre.service';

@Component({
  selector: 'app-genre-list',
  imports: [RouterLink],
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.css'
})
export class GenreListComponent {
  genres: Genre[] = [];

  constructor(
      private genreService: GenreService
  ) {
  }

  ngOnInit(): void {
    this.getAllGenres();
  }
  
  getAllGenres() {
    this.genreService.getAll().subscribe(genre => {
      this.genres = genre;
      console.log(this.genres);
    });
  }


}
