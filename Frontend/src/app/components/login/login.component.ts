import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { MessageService } from '../../services/message.service';




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

  constructor(
     private api: ApiService,
      private auth: AuthService,
     private router: Router,
     private messageService: MessageService,
  ){}

  keepLoggedIn: boolean =false;
  user:User={
    name: '',
    email: '',
    password: '',
  }
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  login(){
    
    let data = {
      email: this.user.email,
      password: this.user.password
    }
    if(!data.email || !data.password){
      this.messageService.show('warn', 'Warning', 'Hiányzó adatok!');
      return
    }
    this.api.login('auth', data).subscribe({
      next: (res)=>{
        this.auth.login((res as any).token);
        if (this.keepLoggedIn) {
          this.auth.storeUser((res as any).token);
          
        }
        
        this.messageService.show('success', 'Success', 'Sikeres Bejelentkezés');
        this.router.navigateByUrl('/dashboard');
      },
      error: (err)=>{
       
        this.messageService.show('error', 'Error', err.error?.error || 'Sikertelen bejelentkezés');
      }
    });
  }

}
