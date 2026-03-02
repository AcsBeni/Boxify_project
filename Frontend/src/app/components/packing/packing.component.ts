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
  recommendedItems: Item[] = [];
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

  
  this.calculateRecommendedItems(box);

  this.showAddDialog = true;
}

  addItemToBox(): void {
  if (!this.selectedBox || !this.selectedItem) {
    this.messageService.show('error', 'Error', 'Please select an item');
    return;
  }

  const box = this.selectedBox;
  const item = this.selectedItem;

  //Fizikai méret check (egy darabnak is bele kell férnie)
  if (
    Number(item.lengthCm) > Number(box.lengthCm) ||
    Number(item.widthCm) > Number(box.widthCm) ||
    Number(item.heightCm) > Number(box.heightCm)
  ) {
    this.messageService.show(
      'error',
      'Too large',
      'Item dimensions exceed the box dimensions'
    );
    return;
  }

  //Súly check (már benne lévőkkel együtt)
  const currentWeight = this.getCurrentBoxWeight(box.id);
  const addedWeight = Number(item.maxWeightKg) * this.quantity;
  const newWeight = currentWeight + addedWeight;

  if (newWeight > Number(box.maxWeightKg)) {
    this.messageService.show(
      'error',
      'Too heavy',
      'Total weight would exceed box capacity'
    );
    return;
  }

  // 3. Térfogat check (már benne lévőkkel együtt)
  const currentVolume = this.getCurrentBoxVolume(box.id);
  const addedVolume = this.getItemVolume(item, this.quantity);
  const boxVolume = this.getBoxVolume(box);

  if (currentVolume + addedVolume > boxVolume) {
    this.messageService.show(
      'error',
      'No space left',
      'Total volume would exceed box capacity'
    );
    return;
  }


  const boxItem: BoxItem = {
    id: '',
    boxId: box.id,
    itemId: item.id,
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
      this.messageService.show(
        'error',
        'Error',
        err.error?.error || 'Failed to add item'
      );
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
  // ===== SÚLY SZÁMÍTÁS =====
private getCurrentBoxWeight(boxId: string): number {
  const itemsInBox = this.getBoxItems(boxId);

  let total = 0;

  for (const bi of itemsInBox) {
    const item = this.getItemDetails(bi.itemId);
    if (item) {
      total += Number(item.maxWeightKg) * bi.quantity;
    }
  }

  return total;
}

// ===== TÉRFOGAT SZÁMÍTÁS =====
private getCurrentBoxVolume(boxId: string): number {
  const itemsInBox = this.getBoxItems(boxId);

  let total = 0;

  for (const bi of itemsInBox) {
    const item = this.getItemDetails(bi.itemId);
    if (item) {
      const volume =
        Number(item.lengthCm) *
        Number(item.widthCm) *
        Number(item.heightCm);

      total += volume * bi.quantity;
    }
  }

  return total;
}

private getItemVolume(item: Item, quantity: number): number {
  const volume =
    Number(item.lengthCm) *
    Number(item.widthCm) *
    Number(item.heightCm);

  return volume * quantity;
}

private getBoxVolume(box: Box): number {
  return (
    Number(box.lengthCm) *
    Number(box.widthCm) *
    Number(box.heightCm)
  );
}
private calculateRecommendedItems(box: Box): void {
  const currentWeight = this.getCurrentBoxWeight(box.id);
  const currentVolume = this.getCurrentBoxVolume(box.id);
  const boxVolume = this.getBoxVolume(box);

  this.recommendedItems = this.items.filter(item => {
    
    if (
      Number(item.lengthCm) > Number(box.lengthCm) ||
      Number(item.widthCm) > Number(box.widthCm) ||
      Number(item.heightCm) > Number(box.heightCm)
    ) {
      return false;
    }

   
    const newWeight = currentWeight + Number(item.maxWeightKg);
    if (newWeight > Number(box.maxWeightKg)) {
      return false;
    }

    
    const itemVolume =
      Number(item.lengthCm) *
      Number(item.widthCm) *
      Number(item.heightCm);

    if (currentVolume + itemVolume > boxVolume) {
      return false;
    }

    return true;
  });
}
}
