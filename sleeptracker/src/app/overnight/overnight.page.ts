import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonCard, IonCardHeader, IonCardTitle, 
        IonCardContent, IonDatetime, IonButton, IonToast} from '@ionic/angular/standalone';

import { SleepStorageService } from '../services/local-storage.service';

interface OvernightRecord {
  sleepStart: string;
  sleepEnd: string;
}

@Component({
  selector: 'app-overnight',
  templateUrl: './overnight.page.html',
  styleUrls: ['./overnight.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, CommonModule, FormsModule, IonCard, IonCardHeader, 
          IonCardTitle, IonCardContent, IonDatetime, IonButton, IonToast]
})

export class OvernightPage {
  sleepStart = new Date().toISOString();
  sleepEnd = new Date().toISOString();

  constructor(private storage: SleepStorageService) {}

  async submitLog(): Promise<void> {
    const start = new Date(this.sleepStart);
    const end = new Date(this.sleepEnd);

    // A wake time earlier than bedtime means the following day.
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const records =
      await this.storage.get<OvernightRecord[]>('overnight-records') ?? [];

    records.push({
      sleepStart: start.toISOString(),
      sleepEnd: end.toISOString(),
    });

    console.log("Logged data: " + this.sleepStart + " " + this.sleepEnd);
    await this.storage.set('overnight-records', records);
  }
}