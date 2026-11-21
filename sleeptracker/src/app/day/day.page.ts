import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonCard, IonCardContent, 
      IonCardHeader, IonCardTitle, IonRange, IonButton, IonDatetime, IonToast} from '@ionic/angular/standalone';

import { SleepStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.page.html',
  styleUrls: ['./day.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, CommonModule, FormsModule, 
        IonCard, IonCardContent, IonCardHeader, IonRange, IonButton, IonCardTitle, IonDatetime, IonToast]
})
export class DayPage implements OnInit {

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

  constructor() { }

  ngOnInit() {
  }

  // used for the "Cancel" button to undo the submit action
  undoSubmit() {
    //  cancel logic
  }

}
