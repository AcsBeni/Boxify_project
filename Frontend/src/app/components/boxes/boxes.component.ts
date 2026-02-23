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
import { RouterModule } from '@angular/router';

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
    private api: ApiService
  ){}

  ngOnInit(): void {
    this.api.getBoxes().subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (err)=>{
        console.log(err.error.error)
      }
    });
  }
  searchTerm = '';
  dialogVisible = false;

  selectedBox: Box | null = null;
  boxItems: Item[] = [];

  boxes: Box[] = [
    {
      id: '1',
      userId: 'u1',
      code: 'BOX-123456',
      labelType: 'QR',
      lengthCm: 40,
      widthCm: 30,
      heightCm: 25,
      maxWeightKg: 20,
      location: 'Shelf A',
      status: 'ACTIVE',
      createdAt: new Date()
    },
    {
      id: '2',
      userId: 'u1',
      code: 'BOX-987654',
      labelType: 'BARCODE',
      lengthCm: 60,
      widthCm: 40,
      heightCm: 30,
      maxWeightKg: 35,
      location: 'Shelf B',
      status: 'ARCHIVED',
      createdAt: new Date()
    }
  ];

  /** 🔍 Keresés code + location alapján */
  get filteredBoxes(): Box[] {
    const term = this.searchTerm.toLowerCase();

    return this.boxes.filter(box =>
      box.code.toLowerCase().includes(term) ||
      box.location?.toLowerCase().includes(term)
    );
  }


  openBox(box: Box) {
    this.selectedBox = box;
    this.dialogVisible = true;

    this.loadBoxItems(box.id);
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