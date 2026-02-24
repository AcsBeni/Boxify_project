import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { Box } from '../../interfaces/box';
import { ChartModule } from 'primeng/chart';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Item } from '../../interfaces/item';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    TableModule,
    ButtonModule,
    ProgressBarModule,
    ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: any;
  boxes: Box[]=[];
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
          this.getBoxes()
        }
        else{
          this.router.navigate(['/login']);
        }
        
    }


    //Data collection---------------------------------------------------------------------------
    getBoxes(){
    
      this.api.getBoxByUserId(this.auth.loggedUser().id).subscribe({
        next: (res) => {
          this.boxes = res as Box[];
          console.log(res)
        },
        error: (err)=>{
          console.log(err.error.error)
        }
      });
    }


    //Chart Renders---------------------------------------------------------------------------
   private initDoughnutChart() {
    const css = getComputedStyle(document.documentElement);

    this.data = {
      labels: ['Tools', 'Electronics', 'Books'],
      datasets: [
        {
          data: [300, 120, 180],
          backgroundColor: [
            css.getPropertyValue('--sage'),
            css.getPropertyValue('--moss'),
            css.getPropertyValue('--sand')
          ]
        }
      ]
    };

    this.options = {
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom' }
      }
    };
  }

  private initBarChart() {
    this.basicData = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Activity',
          data: [540, 325, 702, 620],
          backgroundColor: 'rgba(143, 179, 57, 0.6)'
        }
      ]
    };

    this.basicOptions = {
      scales: {
        y: { beginAtZero: true }
      }
    };
  }
}
