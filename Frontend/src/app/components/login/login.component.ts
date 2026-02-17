import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';




@Component({
  selector: 'app-login',
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
    ButtonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  login(){}

}
