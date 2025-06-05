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
  formSubmitted = false;
  usernameTaken = false;
  emailTaken = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
      ]],
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
    this.formSubmitted = true;

    if (this.signUpForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const { username, email, password } = this.signUpForm.value;

    try {
      const res = await this.authService.register(username, email, password).toPromise();
      this.successMessage = 'Registration successful!';
      this.errorMessage = '';
      this.signUpForm.reset();
      this.formSubmitted = false;

      try {
        const data: any = await this.authService.login(email, password).toPromise();
        this.tokenStorage.saveToken(data);
        await this.userService.save(email);
        const currentUser = this.tokenStorage.getUser();

        if (currentUser && currentUser.role && currentUser.role.name) {
          this.tokenStorage.saveRoles([currentUser.role.name]);
        } else {
          this.tokenStorage.saveRoles([]);
        }
        
        this.isLoggedIn = true;
        this.router.navigate(['/']);
      } catch (loginError) {
        this.errorMessage = loginError.error?.message || 'Login failed';
      }

    } catch (err) {
      const error = err.error?.message || err.error || '';

      this.usernameTaken = false;
      this.emailTaken = false;
      this.errorMessage = '';
      this.successMessage = '';

      if (typeof error === 'string') {
        if (error.toLowerCase().includes('username')) {
          this.usernameTaken = true;
        } else if (error.toLowerCase().includes('email')) {
          this.emailTaken = true;
        } else {
          this.errorMessage = error;
        }
      } else {
        this.errorMessage = "Registration failed. Please try again.";
      }
    }
  }
}