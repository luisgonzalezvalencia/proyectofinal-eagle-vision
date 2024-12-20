import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{
  checkoutForm: FormGroup;
  submitted = false;
  plan: number = 1;
  price: number = 0;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute) {
    this.checkoutForm = this.fb.group({
      cardholderName: ['', [Validators.required]],
      cardNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)],
      ],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  ngOnInit(): void {
    this.plan = parseInt(this.activatedRoute.snapshot.paramMap.get('plan')  || '1');
    switch (this.plan) {
      case 1:
        this.price = 10;
        break;
      case 2:
        this.price = 20;
        break;
      case 3:
        this.price = 50;
        break;
      default:
        this.price = 10;
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.submitted = true;
      console.log('Datos de compra:', this.checkoutForm.value);
    }
  }

  resetForm(): void {
    this.checkoutForm.reset();
    this.submitted = false;
  }
}
