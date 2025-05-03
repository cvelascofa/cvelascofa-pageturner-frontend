import { Routes } from '@angular/router';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { BookDetailComponent } from './components/book/book-detail/book-detail.component';
import { EditorPanelComponent } from './components/editor-panel/editor-panel.component';
import { GenreListComponent } from './components/genre/genre-list/genre-list.component';
import { LanguageListComponent } from './components/language/language-list/language-list.component';
import { EditionTypeListComponent } from './components/edition-type/edition-type-list/edition-type-list.component';
import { PublisherListComponent } from './components/publisher/publisher-list/publisher-list.component';
import { AuthorListComponent } from './components/author/author-list/author-list.component';
import { BookUserListComponent } from './components/book/book-user-list/book-user-list.component';

export const routes: Routes = [
    {
        path: 'admin/books',
        component: BookListComponent
    },
    {
        path: 'book/:id',
        component: BookDetailComponent
    },
    {
        path: '',
        component: BookUserListComponent
    },
    {
        path: 'admin/genres',
        component: GenreListComponent
    },
    {
        path: 'admin/languages',
        component: LanguageListComponent
    },
    {
        path: 'admin/edition-types',
        component: EditionTypeListComponent
    },
    {
        path: 'admin/publishers',
        component: PublisherListComponent
    },
    {
        path: 'admin/authors',
        component: AuthorListComponent
    },
    {
        path: 'books',
        component: BookUserListComponent
    }
];