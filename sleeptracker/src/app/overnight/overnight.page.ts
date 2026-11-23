import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonCard, IonCardHeader, IonCardTitle, 
        IonDatetime, IonButton, IonToast} from '@ionic/angular/standalone';

import { SleepStorageService } from '../services/local-storage.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
  selector: 'app-overnight',
  templateUrl: './overnight.page.html',
  styleUrls: ['./overnight.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, CommonModule, FormsModule, IonCard, IonCardHeader, 
          IonCardTitle, IonDatetime, IonButton, IonToast]
})

export class OvernightPage implements OnInit{
  sleepStart = new Date().toISOString();
  sleepEnd = new Date().toISOString();

  readonly key ='overnight-records';

  // this is the cancel button for the ion-toast in overnight.page.html
   toastButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Cancel button clicked');
        this.undoSubmit();
        
      },
    },
  ];

  constructor(private storage: SleepStorageService) {}

  // submits and saves the log to the data storage
  async submitLog(): Promise<void> {
    const start = new Date(this.sleepStart);
    const end = new Date(this.sleepEnd);

    // A wake time earlier than bedtime means the following day.
    //if (end <= start) {
    //  end.setDate(end.getDate() + 1);
    //}

    const records =
      await this.storage.get<OvernightSleepData[]>(this.key) ?? [];

    records.push(new OvernightSleepData(start, end));

    console.log("Logged data: " + this.sleepStart + " " + this.sleepEnd);
    await this.storage.set(this.key, records);
  }

  // used for the "Cancel" button to undo the submit action
  async undoSubmit() {
    //  cancel logic
    const records = await this.storage.get<OvernightSleepData[]>(this.key);
    records?.pop();
    await this.storage.set(this.key, records);

  }

  ngOnInit(): void {
    
  }
}