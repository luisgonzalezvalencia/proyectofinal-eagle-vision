import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, from, of, switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ClientService } from '../../../services/client.service';

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

  get f() {
    return this.loginForm.controls;
  }

  constructor(
    private authService: AuthService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {}

  signIn() {
    if (this.loginForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;

    from(
      this.authService.signIn(
        this.loginForm.value.username,
        this.loginForm.value.password
      )
    )
      .pipe(
        switchMap((user) => {
          console.log('Usuario autenticado con Google:', user);
          if (user?.uid) {
            return this.clientService.get(user.uid);
          }
          return of(null);
        }),
        catchError((error) => {
          console.error('Error al iniciar sesión con Google:', error);
          this.errorMessage =
            'Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.';
          return of(null);
        })
      )
      .subscribe((client) => {
        this.loading = false;

        if (client) {
          console.log('Cliente obtenido con Google:', client);
          this.router.navigate(['/admin/home']);
        } else {
          this.errorMessage =
            'No se pudo encontrar un cliente asociado al usuario.';
        }
      });
  }

  signInWithGoogle() {
    this.submitted = true;
    this.loading = true;

    from(this.authService.signInWithGoogle())
      .pipe(
        switchMap((user) => {
          console.log('Usuario autenticado con Google:', user);
          if (user?.uid) {
            return this.clientService.get(user.uid);
          }
          return of(null);
        }),
        catchError((error) => {
          console.error('Error al iniciar sesión con Google:', error);
          this.errorMessage =
            'Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.';
          return of(null);
        })
      )
      .subscribe((client) => {
        this.loading = false;

        if (client) {
          console.log('Cliente obtenido con Google:', client);
          this.router.navigate(['/admin/home']);
        } else {
          this.errorMessage =
            'No se pudo encontrar un cliente asociado al usuario.';
        }
      });
  }
}
