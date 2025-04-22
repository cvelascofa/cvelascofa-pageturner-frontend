import { Genre } from "../genre/genre.model";

export class Book {

    id!: number;
    title!: string;
    description!: string;
    publicationYear!: number;
    genreId!: Genre;

}