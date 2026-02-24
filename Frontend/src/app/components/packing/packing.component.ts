import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import * as QRCode from 'qrcode';

import { Box } from '../../interfaces/box';
import { Item } from '../../interfaces/item';
import { BoxItem } from '../../interfaces/box-item';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-packing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    ConfirmDialogModule
  ],
  templateUrl: './packing.component.html',
  styleUrl: './packing.component.scss',
  providers: [ConfirmationService]
})
export class PackingComponent implements OnInit {
  boxes: Box[] = [];
  items: Item[] = [];
  boxItems: BoxItem[] = [];
  boxQRCodes: { [key: string]: string } = {};
  isLoading = false;

  // Dialog states
  showAddDialog = false;
  selectedBox?: Box;
  selectedItem?: Item;
  quantity = 1;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedUser()) {
      return;
    }
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    const userId = this.auth.loggedUser()?.id;

    Promise.all([
      this.api.getBoxByUserId(userId).toPromise(),
      this.api.Items().toPromise()
    ]).then(([boxes, items]: any) => {
      this.boxes = boxes || [];
      this.items = items || [];
      
      // Generate QR codes for each box
      this.boxes.forEach(box => {
        this.generateQRCode(box.code, box.id);
      });
      
      // Load box items for all boxes
      const boxItemPromises = this.boxes.map(box => 
        this.api.getBoxItemsByBoxId(box.id).toPromise()
      );
      
      return Promise.all(boxItemPromises);
    }).then((boxItemsArrays: any) => {
      this.boxItems = (boxItemsArrays || []).flat();
      this.isLoading = false;
    }).catch((err: any) => {
      this.messageService.show('error', 'Error', 'Failed to load data');
      this.isLoading = false;
    });
  }

  generateQRCode(boxCode: string, boxId: string): void {
    QRCode.toDataURL(boxCode, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 200,
      margin: 1,
      color: {
        dark: '#544343',
        light: '#F9F9F9'
      }
    }).then((url: string) => {
      this.boxQRCodes[boxId] = url;
    }).catch((err) => {
      console.error('Error generating QR code:', err);
    });
  }

  getQRCode(boxId: string): string {
    return this.boxQRCodes[boxId] || '';
  }

  getBoxItems(boxId: string): BoxItem[] {
    return this.boxItems.filter(bi => bi.boxId === boxId);
  }

  getItemDetails(itemId: string): Item | undefined {
    return this.items.find(i => i.id === itemId);
  }

  openAddDialog(box: Box): void {
    this.selectedBox = box;
    this.selectedItem = undefined;
    this.quantity = 1;
    this.showAddDialog = true;
  }

  addItemToBox(): void {
    if (!this.selectedBox || !this.selectedItem) {
      this.messageService.show('error', 'Error', 'Please select an item');
      return;
    }

    const boxItem: BoxItem = {
      id: '',
      boxId: this.selectedBox.id,
      itemId: this.selectedItem.id,
      quantity: this.quantity,
      createdAt: new Date()
    };

    this.isLoading = true;
    this.api.insertBoxItem(boxItem).subscribe({
      next: () => {
        this.messageService.show('success', 'Success', 'Item added to box');
        this.showAddDialog = false;
        this.loadData();
      },
      error: (err: any) => {
        this.messageService.show('error', 'Error', err.error?.error || 'Failed to add item');
        this.isLoading = false;
      }
    });
  }

  deleteBoxItem(boxItem: BoxItem): void {
    const item = this.getItemDetails(boxItem.itemId);
    const itemName = item?.name || 'this item';

    this.confirmationService.confirm({
      message: `Are you sure you want to remove "${itemName}" from the box?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoading = true;
        this.api.deleteBoxItem(boxItem.id).subscribe({
          next: () => {
            this.messageService.show('success', 'Success', 'Item removed from box');
            this.loadData();
          },
          error: (err: any) => {
            this.messageService.show('error', 'Error', err.error?.error || 'Failed to remove item');
            this.isLoading = false;
          }
        });
      }
    });
  }
}
