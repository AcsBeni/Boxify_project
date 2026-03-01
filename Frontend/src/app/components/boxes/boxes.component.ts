import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';

import { Box } from '../../interfaces/box';
import { Item } from '../../interfaces/item';
import {ButtonModule } from "primeng/button";
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-boxes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DialogModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule
],
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.scss',
  providers: [ConfirmationService]
})
export class BoxesComponent implements OnInit {

  constructor(
    private router:Router,
    private api: ApiService,
    private auth: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ){}
  searchTerm = '';
  dialogVisible = false;

  selectedBox: Box | null = null;
  boxItems: Item[] = [];
  boxes: Box[] = [ ];



  ngOnInit(): void {
    if(this.auth.isLoggedUser()){
      this.getBoxes()
    }
    else{
      this.router.navigate(['/login']);
    }
    
  
    
  }
  

  /** 🔍 Keresés code + location alapján */
  get filteredBoxes(): Box[] {
    const term = this.searchTerm.toLowerCase();

    return this.boxes.filter(box =>
      box.code.toLowerCase().includes(term) ||
      box.location?.toLowerCase().includes(term)
    );
  }

  getBoxes(){
    
    this.api.getBoxByUserId(this.auth.loggedUser().id).subscribe({
      next: (res) => {
        this.boxes = res as Box[];
      },
      error: (err)=>{
        this.messageService.show('error', 'Nem sikerült a dobozokat megtalálni', err.error?.error || 'Hiba történt a dobozok megtalálása közben');
      }
    });
  }
 
  delete(id:string, code:string){
    
    this.confirmationService.confirm({
      message: `Biztosan törli ezt a dobozt?: "${code}"?`,
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.api.deleteBox(id).subscribe({
          next: () => {
            this.messageService.show('success', 'Success!', 'A dobozt sikeresen törölte');
           
            this.getBoxes();
          },
          error: (err: any) => {
            this.messageService.show('error', 'Nem sikerült törölni a dobozt', err.error?.error || 'Hiba történt a doboz kitörlése közben');
          
          }
        });
      }
    });
  }

}