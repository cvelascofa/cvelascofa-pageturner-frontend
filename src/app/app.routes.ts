import { Routes } from '@angular/router';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { GenreListComponent } from './components/genre/genre-list/genre-list.component';
import { LanguageListComponent } from './components/language/language-list/language-list.component';
import { EditionTypeListComponent } from './components/edition-type/edition-type-list/edition-type-list.component';
import { PublisherListComponent } from './components/publisher/publisher-list/publisher-list.component';
import { AuthorListComponent } from './components/author/author-list/author-list.component';
import { BookUserListComponent } from './components/book/book-user-list/book-user-list.component';
import { BookUserDetailComponent } from './components/book/book-user-detail/book-user-detail.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AdminUserListComponent } from './components/user/admin-user-list/admin-user-list.component';
import { ConnectionsListComponent } from './components/connections/connections-list/connections-list.component';
import { PublicUserDetailComponent } from './components/user/public-user-detail/public-user-detail.component';

export const routes: Routes = [
    {
        path: 'admin/books',
        component: BookListComponent
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
    },
    {
        path: 'book/detail/:idBook',
        component: BookUserDetailComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'sign-up',
        component: SignUpComponent
    },
    {
        path: 'admin/users',
        component: AdminUserListComponent
    },
    {
        path: 'connections',
        component: ConnectionsListComponent
    },
    {
        path: 'user/:id',
        component: PublicUserDetailComponent
    }
];