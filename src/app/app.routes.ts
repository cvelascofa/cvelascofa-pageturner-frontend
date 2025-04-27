import { Routes } from '@angular/router';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { BookDetailComponent } from './components/book/book-detail/book-detail.component';
import { EditorPanelComponent } from './components/editor-panel/editor-panel.component';
import { GenreListComponent } from './components/genre/genre-list/genre-list.component';
import { LanguageListComponent } from './components/language/language-list/language-list.component';
import { EditionTypeListComponent } from './components/edition-type/edition-type-list/edition-type-list.component';
import { PublisherListComponent } from './components/publisher/publisher-list/publisher-list.component';

export const routes: Routes = [
    {
        path: 'books',
        component: BookListComponent
    },
    {
        path: 'book/:id',
        component: BookDetailComponent
    },
    {
        path: '',
        component: EditorPanelComponent
    },
    {
        path: 'genres',
        component: GenreListComponent
    },
    {
        path: 'languages',
        component: LanguageListComponent
    },
    {
        path: 'edition-type',
        component: EditionTypeListComponent
    },
    {
        path: 'publisher',
        component: PublisherListComponent
    }
];