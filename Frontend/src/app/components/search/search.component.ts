import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MessageService } from '../../services/message.service';
import { Box } from '../../interfaces/box';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule,
     FormsModule,
      CardModule, 
      InputTextModule,
    ButtonModule,
  RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  constructor(
    private router: Router,
    private api: ApiService,
    private messageService: MessageService,
  ) {}

  results: any[] = [];
  box: Box[]= []
  isLoading = false;

  search = {
    itemName: '',
   
  };

 async searchItems() {
  this.isLoading = true;

  try {
    const searchTerm = this.search.itemName?.trim();
    if (!searchTerm) {
      this.results = [];
      return;
    }

    // 1️⃣ Tárgyak keresése
    const items = await firstValueFrom(
      this.api.getItemByField('name', 'lk', searchTerm)
    ) as any[];

    if (!items.length) {
      this.results = [];
      return;
    }

    // 2️⃣ Összes box_item kapcsolat
    const allBoxItems = await firstValueFrom(
      this.api.getBoxItems()
    ) as any[];

    const results: any[] = [];

    for (const item of items) {

      const relatedBoxItems = allBoxItems.filter(
        (bi: any) => bi.itemId === item.id
      );

      
      if (!relatedBoxItems.length) {
        results.push({
          itemName: item.name,
          name: item.name,
          boxId: null,
          boxCode: '-',
          location: '-',
          note: '-',
          quantity: 0
        });
        continue;
      }

     
      const boxes = await Promise.all(
        relatedBoxItems.map((bi: any) =>
          firstValueFrom(this.api.getBoxById(bi.boxId))
        )
      );

     
     relatedBoxItems.forEach((bi: any, index: number) => {

      const box = boxes[index] as Box;

      results.push({
        itemName: item.name,
        name: item.name,
        boxId: box?.id || null,
        boxCode: box?.code || '-',
        location: box?.location || '-',
        note: box?.note || '-',
        quantity: bi.quantity || 1
      });

    });
    }

    this.results = results;

  } catch (err: any) {
    this.messageService.show(
      'error',
      'Nem sikerült megtalálni a tárgyat',
      err.error?.error || 'Hiba történt keresés közben'
    );
    this.results = [];
  } finally {
    this.isLoading = false;
  }
}
  clearSearch(){
    this.search = {
    itemName: '',
   
  };
  }

  goToPacking() {
    this.router.navigate(['/packing']);
  }
}