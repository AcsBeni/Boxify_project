import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService,
  ){}

  ngOnInit(): void {
    try{
      this.auth.logout()
      this.messageService.show('success', 'Success', 'Sikeres Kijelentkezés');
      this.router.navigateByUrl("/login")
    }
    catch(err:any){
      this.messageService.show('error', 'Error', err.error?.error || 'Sikertelen Kijelentkezés');
    }
    
  }
}
