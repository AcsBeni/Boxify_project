import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { BoxesComponent } from './components/boxes/boxes.component';
import { ItemsComponent } from './components/items/items.component';
import { PackingComponent } from './components/packing/packing.component';
import { SearchComponent } from './components/search/search.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

export const routes: Routes = [

    //AUTH---------------------------------------------------------------------

      { path: 'login', component: LoginComponent},
      { path: 'logout', component: LogoutComponent},
      { path: 'registration', component: RegistrationComponent},
      { path: 'forgot_password', component: ForgotPasswordComponent},

    //BOXES--------------------------------------------------------------------

        { path: 'boxes',children: [
            { path: '', component: BoxesComponent },
            { path: 'new', component: BoxesComponent },
            { path: ':id', component: BoxesComponent }
        ] },

    //ITEMS------------------------------------------------------------------

        { path: 'items',children: [
            { path: '', component: ItemsComponent },
            { path: 'new', component: ItemsComponent },
            { path: ':id', component: ItemsComponent }
        ] },

    //Packing-------------------------------------------------------

        { path: 'packing',children: [
            { path: '', component: PackingComponent },
            { path: 'new', component: PackingComponent },
            { path: ':id', component: PackingComponent }
        ] },

    //Search---------------------------------------------------------

        { path: 'search', component: SearchComponent},

    //Dashboard--------------------------------------------------------

        { path: 'dashboard', component: DashboardComponent},
    
    //Not found------------------------------------------------------
        
        {path: '**', component:NotfoundComponent},
];
