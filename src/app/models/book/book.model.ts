import { Author } from "../author/author.model";
import { Genre } from "../genre/genre.model";

export class Book {

    id!: number;
    title!: string;
    description!: string;
    publicationDate!: Date;
    genre!: Genre;
    author!: Author;
    
}