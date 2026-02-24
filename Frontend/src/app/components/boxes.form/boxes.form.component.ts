import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

import { Box } from '../../interfaces/box';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
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
  user:User={
    name: '',
    email: '',
    password: ''
  }
  box: Box = {
    id: '',
    userId: this.auth.loggedUser().id,
    code: '',
    labelType: 'QR',
    lengthCm: 0,
    widthCm: 0,
    heightCm: 0,
    maxWeightKg: 0,
    status: 'ACTIVE',
    createdAt: new Date()
  };

  labelTypes = ['QR', 'BARCODE'];
  statuses = ['ACTIVE', 'ARCHIVED', 'DAMAGED'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.boxId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isEditMode = !!this.boxId;
    

    if (this.isEditMode) {
      this.loadBox(this.boxId!);
      this.api.getBoxById(this.boxId!).subscribe({
      next: (res) => {
        this.box = res as Box;
       
      },
      error: (err)=>{
        console.log(err.error.error)
      }
    });


    }
    if(this.auth.isLoggedUser()){
      this.user = this.auth.loggedUser()
      
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
    this.api.insertBox(this.box).subscribe({
      next: (res) => {
        
        console.log(res)
        
      },
      error: (err)=>{
        console.log(err.error.error)
      }
    });
  }

  private updateBox() {
    this.api.updateBox(this.boxId!,this.box!).subscribe({
      next: (res) => {
       
        console.log(res)
      },
      error: (err)=>{
        console.log(err.error.error)
      }
    });
    this.router.navigate(['/boxes']);
  }
}
