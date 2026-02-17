import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 constructor() { }

  private tokenName = environment.tokenName;

  private isLoggedIn = new BehaviorSubject<boolean>(this.getToken());
  isLoggedIn$ = this.isLoggedIn.asObservable();

  getToken(){
    const sess = sessionStorage.getItem(this.tokenName);
    if (sess) return true;

    const locs = localStorage.getItem(this.tokenName);

    if (locs) {
      sessionStorage.setItem(this.tokenName, locs);
      return true;
    }

    return false;
  }

  login(token:string){
    sessionStorage.setItem(this.tokenName, token);
    this.isLoggedIn.next(true);
  }

  logout(){
    sessionStorage.removeItem(this.tokenName);
    localStorage.removeItem(this.tokenName);
    this.isLoggedIn.next(false);
  }

  loggedUser(){
    const token = localStorage.getItem(this.tokenName);
    if (token){
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const decodedUTF8Payload = new TextDecoder('utf-8').decode(
        new Uint8Array(decodedPayload.split('').map(char => char.charCodeAt(0)))
      );
      return JSON.parse(decodedUTF8Payload);
    }
    return null;
  }

  storeUser(token: string){
    localStorage.setItem(this.tokenName, token);
  }

  isLoggedUser():boolean{
    return this.isLoggedIn.value;
  }

  isAdmin():boolean {
    const user: any = this.loggedUser();
    return user.role === 'admin';
  }
}
