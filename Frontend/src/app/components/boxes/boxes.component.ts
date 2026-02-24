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
    RouterModule
],
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.scss'
})
export class BoxesComponent implements OnInit {

  constructor(
    private router:Router,
    private api: ApiService,
    private auth: AuthService
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
    this.api.getBoxes().subscribe({
      next: (res) => {
        this.boxes = res as Box[];
        console.log(res)
      },
      error: (err)=>{
        console.log(err.error.error)
      }
    });
  }
  openBox(box: Box) {
    this.selectedBox = box;
    this.dialogVisible = true;

    this.loadBoxItems(box.id);
  }

  delete(id:string){
    if(confirm("Biztosan törli?")){
      this.api.delete(id).subscribe({
        next: (res) => {
          this.getBoxes()
        },
        error: (err)=>{
          console.log(err.error.error)
        }
    });
    }
  }

  loadBoxItems(boxId: string) {
    this.boxItems = [
      {
        id: 'i1',
        userId: 'u1',
        name: 'Hammer',
        description: 'Steel hammer',
        lengthCm: 30,
        widthCm: 10,
        heightCm: 4,
        maxWeightKg: 1.2,
        createdAt: new Date()
      },
      {
        id: 'i2',
        userId: 'u1',
        name: 'Screwdriver',
        lengthCm: 25,
        widthCm: 3,
        heightCm: 3,
        maxWeightKg: 0.4,
        createdAt: new Date()
      }
    ];
  }
}