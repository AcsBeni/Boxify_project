import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuModule, RippleModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  constructor(private auth: AuthService, private router: Router) {}

  items: MenuItem[] = [];
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.auth.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.items = [
          { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
          { label: 'Boxes', icon: 'pi pi-inbox', routerLink: '/boxes' },
          { label: 'Items', icon: 'pi pi-list', routerLink: '/items' },
          { label: 'Packing', icon: 'pi pi-box', routerLink: '/packing' },
          { label: 'Search', icon: 'pi pi-search', routerLink: '/search' },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
              this.auth.logout?.();
              this.router.navigateByUrl('/login');
            },
          },
        ];
      } else {
        this.items = [
          { label: 'Login', icon: 'pi pi-sign-in', routerLink: '/login' },
          { label: 'Registration', icon: 'pi pi-user-plus', routerLink: '/registration' },
        ];
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}