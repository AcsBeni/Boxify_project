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

    // 1️⃣ Keresés az items táblában névre illeszkedően
    const items = await firstValueFrom(
      this.api.getItemByField('name', 'lk', searchTerm)
    ) as any[];

    if (!items.length) {
      this.results = [];
      return;
    }

    const enrichedResults: any[] = [];

    // 2️⃣ Minden tárgyhoz nézzük meg a box_item kapcsolatot
    for (const item of items) {
      const boxItems = await firstValueFrom(
        this.api.getBoxItemsByBoxId(item.id) 
      ) as any[];

      // Ha nincs box_items, csak a tárgyat adjuk vissza
      if (!boxItems.length) {
        enrichedResults.push({
          ...item,
          boxCode: '-',
          location: '-',
          note: '-'
        });
        continue;
      }

      // 3️⃣ Minden kapcsolódó doboz lekérése
      for (const bi of boxItems) {
        const box = await firstValueFrom(this.api.getBoxById(bi.boxId)) as any;
        enrichedResults.push({
          ...item,
          name: item.name,
          boxId: box?.boxId || '-',
          boxCode: box?.code || '-',
          location: box?.location || '-',
          note: box?.note || '-'
        });
      }
    }

    this.results = enrichedResults;

  } catch (err: any) {
    this.messageService.show(
      'error',
      'Nem sikerült megtalálni a tárgyat',
      err.error?.error || 'A tárgy keresése közben hiba történt'
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