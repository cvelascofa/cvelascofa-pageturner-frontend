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
import { ChallengeListComponent } from './components/challenge/challenge-list/challenge-list.component';
import { ErrorPageComponent } from './components/error-page/error-page/error-page.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    {
        path: 'admin/books',
        component: BookListComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'LIBRARIAN'] }
    },
    {
        path: '',
        component: BookUserListComponent,
    },
    {
        path: 'admin/genres',
        component: GenreListComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'LIBRARIAN'] }
    },
    {
        path: 'admin/languages',
        component: LanguageListComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'LIBRARIAN'] }
    },
    {
        path: 'admin/edition-types',
        component: EditionTypeListComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'LIBRARIAN'] }
    },
    {
        path: 'admin/publishers',
        component: PublisherListComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'LIBRARIAN'] }
    },
    {
        path: 'admin/authors',
        component: AuthorListComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'LIBRARIAN'] }
    },
    {
        path: 'books',
        component: BookUserListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'book/detail/:idBook',
        component: BookUserDetailComponent,
        canActivate: [authGuard]
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
        component: AdminUserListComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] }
    },
    {
        path: 'connections',
        component: ConnectionsListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'user/:id',
        component: PublicUserDetailComponent,
        canActivate: [authGuard]
    },
    {
        path: 'challenges/:id',
        component: ChallengeListComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        component: ErrorPageComponent
    }
];