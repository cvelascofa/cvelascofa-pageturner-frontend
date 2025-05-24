import { User } from "../user/user.model";

export class ReviewWithUser {

    userId: number;
    bookId: number;
    rating: number;
    comment: string;
    user?: User;

}
