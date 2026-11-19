import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, 
  IonCardTitle} from '@ionic/angular/standalone';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, 
      IonCardContent, IonCardHeader, IonCardTitle]
})
export class StatsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
