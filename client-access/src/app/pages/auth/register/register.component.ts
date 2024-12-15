import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  router = inject(Router);

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  errorMessage: string = '';
  loading = false;
  submitted = false;

  get f() {
    return this.registerForm.controls;
  }

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    this.submitted = true;
    this.loading = true;
    this.authService
      .register(this.registerForm.value.email, this.registerForm.value.password)
      .then((response) => {
        this.router.navigate(['/login']);
      })
      .catch((error: any) => {
        this.errorMessage = error.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
