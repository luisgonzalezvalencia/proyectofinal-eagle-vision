import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public formReg: FormGroup;
  public loading: boolean = false;
  public errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.formReg = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  onSubmit() {
    this.loading = true;
    this.authService
      .register(this.formReg.value.email, this.formReg.value.password)
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
