import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../_service/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../_service/token-storage/token-storage.service';
import { UserService } from '../../_service/user/user.service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  signUpForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoggedIn = false;
  roles: string[] = [];

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get username() {
    return this.signUpForm.get('username')!;
  }

  get email() {
    return this.signUpForm.get('email')!;
  }

  get password() {
    return this.signUpForm.get('password')!;
  }

  async onSubmitSignUp(): Promise<void> {
    if (this.signUpForm.invalid) return;

    const { username, email, password } = this.signUpForm.value;

    try {
      const res = await this.authService.register(username, email, password).toPromise();
      this.successMessage = 'Registration successful!';
      this.errorMessage = '';
      this.signUpForm.reset();

      try {
        const data: any = await this.authService.login(email, password).toPromise();
        this.tokenStorage.saveToken(data);
        await this.userService.saveUser(email);

        this.roles = this.tokenStorage.getUser().roles || [];
        this.tokenStorage.saveRoles(this.roles);

        this.isLoggedIn = true;
        this.router.navigate(['/']);
      } catch (loginError) {
        this.errorMessage = loginError.error?.message || 'Login failed';
      }

    } catch (err) {
      this.errorMessage = err.error?.message || 'Registration failed';
      this.successMessage = '';
    }
  }
}