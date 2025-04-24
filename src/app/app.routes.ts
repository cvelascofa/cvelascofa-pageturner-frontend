import { Routes } from '@angular/router';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { BookDetailComponent } from './components/book/book-detail/book-detail.component';
import { EditorPanelComponent } from './components/editor-panel/editor-panel.component';

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
    }
];