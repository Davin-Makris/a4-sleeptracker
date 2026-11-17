import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { statsChart, moon, home, sunny, person } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon],
})
export class TabsPage {

  constructor() {

    addIcons({ statsChart, moon, home, sunny, person });
  
  }
}
