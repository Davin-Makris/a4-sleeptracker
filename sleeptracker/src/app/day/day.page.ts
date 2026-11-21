import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonCard, IonCardContent, 
      IonCardHeader, IonCardTitle, IonRange, IonButton, IonDatetime, IonToast} from '@ionic/angular/standalone';

import { SleepStorageService } from '../services/local-storage.service';

interface SleepinessRecord{
  timeOfDay: string;
  sleepinessScore : number;
}

@Component({
  selector: 'app-day',
  templateUrl: './day.page.html',
  styleUrls: ['./day.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, CommonModule, FormsModule, 
        IonCard, IonCardContent, IonCardHeader, IonRange, IonButton, IonCardTitle, IonDatetime, IonToast]
})
export class DayPage implements OnInit {
  timeOfDay = new Date().toISOString();
  sleepinessScore = 0;

  readonly key = "sleepiness-records"

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
      const time = new Date(this.timeOfDay);
      const score = this.sleepinessScore;
  
      const records =
        await this.storage.get<SleepinessRecord[]>(this.key) ?? [];
  
      records.push({
        timeOfDay: time.toISOString(),
        sleepinessScore: score,
      });
  
      console.log("Logged data: " + time + " " + score);
      await this.storage.set(this.key, records);
    }
  
    // used for the "Cancel" button to undo the submit action
    async undoSubmit() {
      //  cancel logic
      const records = await this.storage.get<SleepinessRecord[]>(this.key);
      records?.pop();
      await this.storage.set(this.key, records);
  
    }

    ngOnInit(): void {
      
    }

}
