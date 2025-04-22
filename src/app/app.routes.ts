import { Routes } from '@angular/router';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { BookDetailComponent } from './components/book/book-detail/book-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: BookListComponent
    },
    {
        path: '/book/:id',
        component: BookDetailComponent
    }
];