import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { User } from '../../interfaces/user';
import { ApiService } from '../../services/api.service';

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
  constructor(
    private api: ApiService,
    private router: Router
  ){}

  user:User={
    name: '',
    email: '',
    password: '',
    confirm:''
  }
  register() {
  
    if(!this.user.name || !this.user.email || !this.user.password || !this.user.confirm){
      alert("Hiányzó adatok")
      return
    }
    this.api.registration('auth', this.user).subscribe({
      
      next: (res)=>{
        alert('Sikeres regisztráció! Bejelentkezhetsz!');
        this.router.navigateByUrl('/login');
      },
      error: (err)=>{
        console.log(err);
        alert(err.error.error);
      }
    });

    
}}
