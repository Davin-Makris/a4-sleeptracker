import { Component } from '@angular/core';
// import that elements we want to use
import { IonHeader, IonTitle, IonContent, IonFooter, IonButton, IonButtons, IonIcon, IonRow, IonCol,
		IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; // import addIcons() so we can get out icons
import {statsChart, moon, home, sunny, person, sad} from 'ionicons/icons'; // import the name of the icons we want to use, use camelCase
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonTitle, IonContent, IonFooter, IonButton, IonButtons, IonIcon, IonRow, IonCol, 
			IonCard, IonCardHeader, IonCardTitle, IonCardContent, RouterLink
  ],
})
export class HomePage {
  constructor(public sleepService:SleepService) {
		addIcons({statsChart, moon, home, sunny, person, sad}); // call the addIcons() func with our icons so we can use them
	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}
}
