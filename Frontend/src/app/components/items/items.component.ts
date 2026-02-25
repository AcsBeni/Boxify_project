import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { Item } from '../../interfaces/item';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    RouterModule,
    TableModule,
    ConfirmDialogModule
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
  providers: [ConfirmationService]
})
export class ItemsComponent implements OnInit {
  isFormMode = false;
  isEditMode = false;
  itemId?: string;
  isLoading = false;
  items: Item[] = [];

  item: Item = {
    id: '',
    userId: '',
    name: '',
    description: '',
    lengthCm: 0,
    widthCm: 0,
    heightCm: 0,
    maxWeightKg: 0,
    createdAt: new Date()
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private api: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedUser()) {
      this.router.navigate(['/login']);
      return;
    }

    const loggedUser = this.auth.loggedUser();
    this.item.userId = loggedUser?.id || '';

    this.itemId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.itemId) {
      this.isFormMode = true;
      this.isEditMode = true;
      this.loadItem(this.itemId);
    } else {
      this.loadItems();
    }
  }

  loadItems(): void {
    this.isLoading = true;
    this.api.Items().subscribe({
      next: (res: any) => {
        this.items = res;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.messageService.show('error', 'Failed to load items', err.error?.error || 'An error occurred');
        this.isLoading = false;
      }
    });
  }

  createNew(): void {
    this.item = {
      id: '',
      userId: this.auth.loggedUser().id,
      name: '',
      description: '',
      lengthCm: 0,
      widthCm: 0,
      heightCm: 0,
      maxWeightKg: 0,
      createdAt: new Date()
    };
    this.isFormMode = true;
    this.isEditMode = false;
    this.itemId = undefined;
  }

  backToList(): void {
    this.isFormMode = false;
    this.loadItems();
  }

  editItem(item: Item): void {
    this.item = { ...item };
    this.itemId = item.id;
    this.isFormMode = true;
    this.isEditMode = true;
  }

  deleteItem(item: Item): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the item "${item.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoading = true;
        this.api.deleteItem(item.id).subscribe({
          next: () => {
            this.messageService.show('success', 'Success!', 'Item deleted successfully');
            this.isLoading = false;
            this.loadItems();
          },
          error: (err: any) => {
            this.messageService.show('error', 'Failed to delete item', err.error?.error || 'An error occurred');
            this.isLoading = false;
          }
        });
      }
    });
  }

  private loadItem(id: string): void {
    this.isLoading = true;
    this.api.getItemById(id).subscribe({
      next: (res: any) => {
        this.item = res as Item;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.messageService.show('error', 'Failed to load item', err.error?.error || 'An error occurred while fetching the item');
        this.isLoading = false;
      }
    });
  }

  save(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    if (this.isEditMode && this.itemId) {
      this.api.updateItem(this.itemId, this.item).subscribe({
        next: () => {
          this.messageService.show('success', 'Success!', 'Item updated successfully');
          this.isLoading = false;
          this.backToList();
        },
        error: (err: any) => {
          this.messageService.show('error', 'Failed to update item', err.error?.error || 'An error occurred while updating the item');
          this.isLoading = false;
        }
      });
    } else {
      this.api.insertItem(this.item).subscribe({
        next: () => {
          this.messageService.show('success', 'Success!', 'Item created successfully');
          this.isLoading = false;
          this.backToList();
        },
        error: (err: any) => {
          this.messageService.show('error', 'Failed to create item', err.error?.error || 'An error occurred while creating the item');
          this.isLoading = false;
        }
      });
    }
  }

  private validateForm(): boolean {
    if (!this.item.name || this.item.name.trim() === '') {
      this.messageService.show('error', 'Error!', 'Item name is required');
      return false;
    }

    if (!this.item.lengthCm || this.item.lengthCm <= 0) {
      this.messageService.show('error', 'Error!', 'Length must be greater than 0');
      return false;
    }

    if (!this.item.widthCm || this.item.widthCm <= 0) {
      this.messageService.show('error', 'Error!', 'Width must be greater than 0');
      return false;
    }

    if (!this.item.heightCm || this.item.heightCm <= 0) {
      this.messageService.show('error', 'Error!', 'Height must be greater than 0');
      return false;
    }

    if (!this.item.maxWeightKg || this.item.maxWeightKg <= 0) {
      this.messageService.show('error', 'Error!', 'Max weight must be greater than 0');
      return false;
    }

    return true;
  }
}
