import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_service/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { TokenStorageService } from '../../_service/token-storage/token-storage.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../_service/user/user.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink,CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  invisLogin: boolean = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const token = this.tokenStorage.getToken();
    if (token) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async onSubmitLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.invisLogin = true;
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      const data: any = await this.authService.login(email, password).toPromise();
      this.tokenStorage.saveToken(data);
      await this.userService.saveUser(email);

      this.roles = this.tokenStorage.getUser().role;
      this.tokenStorage.saveRoles(this.roles);

      this.isLoggedIn = true;
      this.isLoginFailed = false;
      this.router.navigate(['/']);
    } catch (error) {
      this.isLoginFailed = true;
    }
  }

  reloadPage(): void {
    window.location.reload();
  }
}
