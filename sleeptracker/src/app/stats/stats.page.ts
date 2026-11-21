import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, 
  IonCardTitle, IonButton} from '@ionic/angular/standalone';

import { SleepStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, 
      IonCardContent, IonCardHeader, IonCardTitle, IonButton]
})
export class StatsPage implements OnInit {
  allRecords: unknown[] = [];

  constructor(private storage: SleepStorageService) {}

  ngOnInit() {
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
