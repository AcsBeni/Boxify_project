import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
    private router: Router
  ){}

  ngOnInit(): void {
    this.auth.logout()
    this.router.navigateByUrl("/login")
  }
}
