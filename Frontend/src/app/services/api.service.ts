import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private server = environment.serverUrl;
  private tokenName = environment.tokenName;
  constructor(private http: HttpClient) { }

  getToken(): String | null {
    return sessionStorage.getItem(this.tokenName);
  }

  tokenHeader():{ headers: HttpHeaders }{
    
    let token = this.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return { headers }
  }

  // PUBLIC ENDPOINTS --------------------------------------------------------------

  registration(table: string, data: object){
    return this.http.post(`${this.server}/${table}/registration`, data);
  }

  login(table: string, data: object){
    return this.http.post(`${this.server}/${table}/login`, data);
  }

  // BOXES--------------------------------------------------------------------------------

  getBoxes(){
    
    return this.http.get(`${this.server}/boxes`, this.tokenHeader())
  }
  getBoxById(id:string){
    return this.http.get(`${this.server}/boxes/${id}`, this.tokenHeader())
  }
  getBoxByUserId(id:string){
    return this.http.get(`${this.server}/boxes/user/${id}`, this.tokenHeader())
  }
  insertBox(data:object){
    return this.http.post(`${this.server}/boxes`,data, this.tokenHeader())
  }
  getBoxByField( field: string, op: string, value: string){
    return this.http.get(`${this.server}/boxes/${field}/${op}/${value}`, this.tokenHeader());
  }
  updateBox(id:string, data:object){
    return this.http.patch(`${this.server}/boxes/${id}`,data, this.tokenHeader())
  }
  deleteBox(id:string){
    return this.http.delete(`${this.server}/boxes/${id}`, this.tokenHeader())
  }


  //Items


  Items(){
    
    return this.http.get(`${this.server}/items`, this.tokenHeader())
  }
  getItemById(id:string){
    return this.http.get(`${this.server}/items/${id}`, this.tokenHeader())
  }
  getItemByBoxId(id:string){
    return this.http.get(`${this.server}/items/box/${id}`, this.tokenHeader())
  }
  insertItem(data:object){
    return this.http.post(`${this.server}/items`,data, this.tokenHeader())
  }
  getItemByField( field: string, op: string, value: string){
    return this.http.get(`${this.server}/items/${field}/${op}/${value}`, this.tokenHeader());
  }
  updateItem(id:string, data:object){
    return this.http.patch(`${this.server}/items/${id}`,data, this.tokenHeader())
  }
  deleteItem(id:string){
    return this.http.delete(`${this.server}/items/${id}`, this.tokenHeader())
  }


}
