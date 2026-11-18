import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonCard, IonCardContent, 
      IonCardHeader, IonCardTitle, IonRange, IonButton, IonDatetime} from '@ionic/angular/standalone';

@Component({
  selector: 'app-day',
  templateUrl: './day.page.html',
  styleUrls: ['./day.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, CommonModule, FormsModule, 
        IonCard, IonCardContent, IonCardHeader, IonRange, IonButton, IonCardTitle, IonDatetime]
})
export class DayPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
