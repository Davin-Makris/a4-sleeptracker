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
  pfpIconName: string = "person"; // the pfp is the "person" icon by default

  constructor() { }

  ngOnInit() {
  }

  // used for the (click) action of the icon buttons
  changePfpToPerson (): void{
    this.pfpIconName = "person";
  }

  changePfpToMoon (): void{
    this.pfpIconName = "moon";
  }

  changePfpToSun (): void{
    this.pfpIconName = "sunny";
  }

  changePfpToHeart (): void{
    this.pfpIconName = "heart";
  }

  changePfpToHappy (): void{
    this.pfpIconName = "happy";
  }

}
