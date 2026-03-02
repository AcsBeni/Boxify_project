import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { Box } from '../../interfaces/box';
import { ChartModule } from 'primeng/chart';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Item } from '../../interfaces/item';
import { BoxItem } from '../../interfaces/box-item';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    TableModule,
    ButtonModule,
    ProgressBarModule,
    ChartModule,
    RouterLink
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: any;
  boxes: Box[]=[];
  boxItems: BoxItem[]=[]
  items: Item[]=[];
  
  data: any;
  basicData: any;
  basicOptions: any;
  options: any;
  constructor(
    private router:Router,
    private auth: AuthService,
    private api: ApiService
  ){}

    ngOnInit() {
        if(this.auth.isLoggedUser()){
          this.initDoughnutChart()
          this.initBarChart()
          this.getData()

        }
        else{
          this.router.navigate(['/login']);
        }
        
    }


    //Data collection---------------------------------------------------------------------------
   async getData() {
      try {
        const userId = this.auth.loggedUser().id;

        //  dobozok
        this.boxes = (await this.api.getBoxByUserId(userId).toPromise()) as Box[];

        // minden boxItem
        const boxItemPromises = this.boxes.map(box =>
          this.api.getBoxItemsByBoxId(box.id).toPromise()
        );
        const boxItemsArrays = await Promise.all(boxItemPromises);
        this.boxItems = boxItemsArrays.flat() as BoxItem[];

       
        this.items = (await this.api.Items().toPromise()) as Item[];

        // számolt mezők a táblához
        this.attachBoxComputedFields();

        // chart frissítés
        this.initBarChart();
        this.initDoughnutChart();

      } catch (err: any) {
        console.log(err);
      }
    }

    //Box delete, item delete // TODO: DAShboard, message behelyezése, confirm update, itemek ellenőrzése a dobozhoz, capacity calc, keresés, guard, PASS ELLENŐRZÉS, dodboz kód ellenőrzés + generálás
    deleteBoxes(){
      if(confirm("Biztosan töröl minden dobozt?")){
        this.api.deleteBoxes(this.auth.loggedUser().id).subscribe({
        next: (res) => {
         
          console.log(res)
        },
        error: (err)=>{
          console.log(err.error.error)
        }
      });
      }
      this.getData()
    }
   


    //Chart Renders---------------------------------------------------------------------------
     private initDoughnutChart() {
      const usedPercent = this.getUsedVolumePercentage();
      const availablePercent = 100 - usedPercent;
      const css = getComputedStyle(document.documentElement);

      this.data = {
        labels: ['Használt tárhely', 'Elérhető tárhely'],
        datasets: [
          {
            data: [usedPercent, availablePercent],
            backgroundColor: [
              css.getPropertyValue('--color-sage-green'),
              css.getPropertyValue('--color-alabaster-grey')
            ]
          }
        ]
      };

      this.options = {
        responsive: true,
        aintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom' }
        }
      };
    }

 private initBarChart() {
  if (!this.boxes || this.boxes.length === 0) return;

  const labels = this.boxes.map(box => box.code);
  const dataValues = this.boxes.map(box => this.getBoxUsedPercentage(box));

  this.basicData = {
    labels: labels,
    
    datasets: [
      {
        label: 'Foglaltság (%)',
        data: dataValues,
        backgroundColor: 'rgba(143, 179, 57, 0.6)'
      }
    ]
  };

  this.basicOptions = {
     responsive: true,
       scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: 'Kapacitás (%)' }
      },
      x: {
        title: { display: true, text: 'Dobozok' }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };
}
  // Összes doboz maximális térfogata
getTotalBoxVolume(): number {
  return this.boxes.reduce((sum, box) => {
    return sum + box.lengthCm * box.widthCm * box.heightCm;
  }, 0);
}

// Összes doboz aktuálisan foglalt térfogata a boxItems alapján
getUsedBoxVolume(): number {
  let totalUsed = 0;
  this.boxes.forEach(box => {
    const itemsInBox = this.boxItems.filter(bi => bi.boxId === box.id);
    itemsInBox.forEach(bi => {
      const item = this.items.find(i => i.id === bi.itemId);
      if (item) {
        totalUsed += item.lengthCm * item.widthCm * item.heightCm * bi.quantity;
      }
    });
  });
  return totalUsed;
}
private getBoxUsedPercentage(box: Box): number {
  const itemsInBox = this.boxItems.filter(bi => bi.boxId === box.id);

  const boxVolume = box.lengthCm * box.widthCm * box.heightCm;
  if (boxVolume === 0) return 0;

  let usedVolume = 0;
  itemsInBox.forEach(bi => {
    const item = this.items.find(i => i.id === bi.itemId);
    if (item) {
      const itemVolume = item.lengthCm * item.widthCm * item.heightCm;
      usedVolume += itemVolume * bi.quantity;
    }
  });

  return Math.round((usedVolume / boxVolume) * 100);
}
// Felhasználtság százalék
getUsedVolumePercentage(): number {
  const totalVolume = this.getTotalBoxVolume();
  if (totalVolume === 0) return 0;
  const usedVolume = this.getUsedBoxVolume();
  return Math.round((usedVolume / totalVolume) * 100);
}
private attachBoxComputedFields() {
  this.boxes = this.boxes.map(box => {

    const itemsInBox = this.boxItems.filter(bi => bi.boxId === box.id);

    const itemCount = itemsInBox.reduce((sum, bi) => sum + bi.quantity, 0);

    const capacity = this.getBoxUsedPercentage(box);

    return {
      ...box,
      items: itemCount,
      capacity: capacity
    } as any;
  });
}
getEmptyBoxCount(): number {
  return this.boxes.filter(box =>
    !this.boxItems.some(bi => bi.boxId === box.id)
  ).length;
}
getMaxCapacity(): number {
  if (!this.boxes.length || !this.boxItems.length) return 0;

  let max = 0;

  for (const box of this.boxes) {
    const percent = this.getBoxUsedPercentage(box);
    if (percent > max) max = percent;
  }

  return max;
}

getUniqueItemCount(): number {
  const unique = new Set(this.boxItems.map(bi => bi.itemId));
  return unique.size;
}
}
