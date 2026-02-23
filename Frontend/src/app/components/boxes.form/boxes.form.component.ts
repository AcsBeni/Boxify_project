import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

import { Box } from '../../interfaces/box';
@Component({
  selector: 'app-boxes.form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    RouterModule
],
  templateUrl: './boxes.form.component.html',
  styleUrl: './boxes.form.component.scss'
})
export class BoxesFormComponent implements OnInit {

  isEditMode = false;
  boxId?: string;

  box: Box = {
    id: '',
    userId: '',
    code: '',
    labelType: 'QR',
    lengthCm: 0,
    widthCm: 0,
    heightCm: 0,
    maxWeightKg: 0,
    status: 'ACTIVE'
    
  };

  labelTypes = ['QR', 'BARCODE'];
  statuses = ['ACTIVE', 'ARCHIVED', 'DAMAGED'];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.boxId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isEditMode = !!this.boxId;

    if (this.isEditMode) {
      this.loadBox(this.boxId!);
    }
  }

  /** empty model for /new */
  private createEmptyBox(): Box {
    return {
      id: '',
      userId: '',
      code: '',
      labelType: 'QR',
      lengthCm: 0,
      widthCm: 0,
      heightCm: 0,
      maxWeightKg: 0,
      location: '',
      note: '',
      status: 'ACTIVE',
      createdAt: new Date()
    };
  }

  /** MOCK – replace with API */
  private loadBox(id: string) {
    this.box = {
      id,
      userId: 'u1',
      code: 'BOX-123456',
      labelType: 'QR',
      lengthCm: 40,
      widthCm: 30,
      heightCm: 25,
      maxWeightKg: 20,
      location: 'Shelf A',
      note: 'Fragile',
      status: 'ACTIVE',
      createdAt: new Date()
    };
  }

  save() {
    if (this.isEditMode) {
      this.updateBox();
    } else {
      this.createBox();
    }
  }

  private createBox() {
    console.log('CREATE', this.box);
    this.router.navigate(['/boxes']);
  }

  private updateBox() {
    console.log('UPDATE', this.boxId, this.box);
    this.router.navigate(['/boxes']);
  }
}
