import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
      IonButton, IonIcon, IonInput, IonItem, IonRadio, IonRadioGroup} from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, CommonModule, FormsModule, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
      IonButton, IonIcon, IonInput, IonItem, IonRadio, IonRadioGroup]
})
export class ProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
