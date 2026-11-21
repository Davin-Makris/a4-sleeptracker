import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent,
      IonButton, IonIcon, IonInput, IonItem, IonRadio, IonRadioGroup, IonToast} from '@ionic/angular/standalone';

import { SleepStorageService } from '../services/local-storage.service';

interface UserInfo{
  userName :string;
  isMorningPerson:boolean;
  pfpIconName:string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonCardContent,
      IonButton, IonIcon, IonInput, IonItem, IonRadio, IonRadioGroup, IonToast]
})

export class ProfilePage implements OnInit {
  userName: string = "" // set to blank as deafult
  pfpIconName: string = "person"; // the pfp is the "person" icon by default
  isMorningPerson: boolean = true;

  placeholderStr: string = "Enter your name here";

  readonly key = "profile-info";

  constructor(private storage: SleepStorageService) { }

  ngOnInit() {
  }

  // save button click
  saveButton(userInput: string | number | null | undefined): void {
    this.userName = (userInput ?? (this.userName ?? '')).toString().trim();
    this.placeholderStr = (userInput ?? (this.userName ?? '')).toString();
    this.SaveProfileSettings();
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

  async SaveProfileSettings(): Promise<void>{
    const settings :UserInfo = {
      userName: this.userName,
      isMorningPerson: this.isMorningPerson ?? true,
      pfpIconName: this.pfpIconName
    }
    console.log(settings);
    this.storage.set(this.key, settings);
  }

  async ionViewWillEnter(): Promise<void> {
    const settings:UserInfo | undefined = await this.storage.get<UserInfo>(this.key);

    if (!settings){
      return;
    }

    this.isMorningPerson = settings.isMorningPerson;
    this.pfpIconName = settings.pfpIconName;
    this.userName = settings.userName;

    this.placeholderStr = ((this.userName ?? "Enter your name here")).toString().trim();
  }

}
