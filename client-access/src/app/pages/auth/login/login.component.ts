import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  errorMessage: string = '';
  loading = false;
  submitted = false;

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.authService
      .signIn(this.loginForm.value.username, this.loginForm.value.password)
      .then((response) => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log(error);
        this.errorMessage =
          'Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.';
      })
      .finally(() => {
        this.loading = false;
      });
  }

  get f() {
    return this.loginForm.controls;
  }

  loginWithGoogle() {
    this.loading = true;
    this.submitted = false;
    this.authService
      .loginWithGoogle()
      .then((response) => {
        this.router.navigate(['/admin/home']);
      })
      .catch((error) => {
        this.errorMessage =
          'Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.';
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
