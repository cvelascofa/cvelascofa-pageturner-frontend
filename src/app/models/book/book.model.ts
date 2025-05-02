import { Author } from "../author/author.model";
import { Genre } from "../genre/genre.model";

export class Book {

    id!: number;
    title!: string;
    description!: string;
    publicationYear!: number;
    genre!: Genre;
    authors!: Author[];
    
}