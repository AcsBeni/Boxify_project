import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { Item } from '../../interfaces/item';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,MenuModule, BadgeModule, RippleModule, AvatarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

    constructor(
        private auth: AuthService,
        private router: Router
    ){}
    items: Item[] | undefined;

    ngOnInit() {
        this.setupMenu()
    }

    setupMenu(){
        this.items= [
        {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
        },
        {
        label: 'Boxes',
        icon: 'pi pi-inbox',
        routerLink: '/boxes'
        },
        {
        label: 'Items',
        icon: 'pi pi-list',
        routerLink: '/items'
        },
        {
        label: 'Packing',
        icon: 'pi pi-box',
        routerLink: '/packing'
        },
        {
        label: 'Search',
        icon: 'pi pi-search',
        routerLink: '/search'
        },
        
        {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        routerLink: '/logout'
        }
    ];
    }

}
