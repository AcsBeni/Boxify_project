import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    RouterLink,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    CardModule,
    CommonModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
   name = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;
  register() {
    if (!this.acceptTerms) {
      alert('Fogadja el a feltételeket!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('A jelszavak nem egyeznek!');
      return;
    }

    console.log({
      name: this.name,
      email: this.email,
      password: this.password
    });
}}
