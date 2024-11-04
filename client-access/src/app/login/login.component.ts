import { Component, inject, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });;

  loading = false;
  submitted = false;


  constructor() { }
  ngOnInit(): void {
    console.log(this.loginForm);
  }

  onSubmit() {
    console.log('submit');

  }

  get f() {
    return this.loginForm.controls;
  }

}
