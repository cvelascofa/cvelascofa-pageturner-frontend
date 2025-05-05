import { Author } from "../author/author.model";
import { EditionType } from "../edition-type/edition-type.model";
import { Genre } from "../genre/genre.model";
import { Language } from "../language/language.model";
import { Publisher } from "../publisher/publisher.model";

export class Book {

    id!: number;
    title!: string;
    description!: string;
    coverImage!: string;
    isbn!: string;
    publicationDate!: Date;
    pages!: number;

    genre!: Genre;
    language!: Language;
    author!: Author;
    publisher!: Publisher;
    editionType!: EditionType;
    
}