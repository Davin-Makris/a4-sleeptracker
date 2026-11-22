import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonCardHeader, 
  IonCardTitle, IonButton} from '@ionic/angular/standalone';
import {Chart, LineController} from "chart.js"

import { SleepStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, 
      IonCardContent, IonCardHeader, IonCardTitle, IonButton]
})
export class StatsPage implements OnInit {
  allRecords: unknown[] = [];

  constructor(private storage: SleepStorageService) {}

  ngOnInit() {
    const canvas = document.getElementById('sleep-line-chart') as HTMLCanvasElement | null;
    const data = [1,2,3,4,5];
    if (canvas) {
      const lineChart :Chart = new Chart(canvas, {
      type: 'line',
      data: {
          labels: ['A', 'B', 'C', 'D', 'E'], // Required: matches the length of your data array
          datasets: [
            {
              label: 'My Dataset',
              data: data
            },
          ],
        },
      });
    } 
  }

  async clearData(): Promise<void> {
    await this.storage.reset();
    this.allRecords = [];
  }

  async ionViewWillEnter(): Promise<void> {
    const [overnightRecords, sleepinessRecords] = await Promise.all([
      this.storage.get<unknown[]>('overnight-records'),
      this.storage.get<unknown[]>('sleepiness-records'),
    ]);

    this.allRecords = [
      ...(overnightRecords ?? []),
      ...(sleepinessRecords ?? []),
    ];
  }

}
