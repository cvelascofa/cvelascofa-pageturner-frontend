import { ReadingStatus } from "../reading-status/reading-status.model";

export class ReadingProgress {
    
    id?: number;
    userId!: number;
    bookId!: number;
    readingStatus: string;
    pagesRead!: number;
    progressDate?: string;

}