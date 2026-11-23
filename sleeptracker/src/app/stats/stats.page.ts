import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonCardHeader, 
  IonCardTitle, IonButton, IonToast} from '@ionic/angular/standalone';
import Chart from "chart.js/auto"

import { OvernightSleepData } from '../data/overnight-sleep-data';
import { SleepStorageService } from '../services/local-storage.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, 
      IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonToast]
})
export class StatsPage implements OnInit {
  sleepRecords: OvernightSleepData[] = [];
  wakeRecords: StanfordSleepinessData[] = [];
  private OvernightChart?: Chart;

  // this is the cancel button for the clear data ion-toast in stats.page.html
   toastButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.undoClearData();
      },
    },
  ];

  constructor(private storage: SleepStorageService) {}

  ngOnInit() {
    
  }

  async clearData(): Promise<void> {
    await this.storage.reset();
    await this.fetchRecords();
    this.makeOvernightChart();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.fetchRecords();
    this.makeOvernightChart();
  }

  private async fetchRecords(): Promise<void> {
    const [overnightRecords, sleepinessRecords] = await Promise.all([
      this.storage.get<OvernightSleepData[]>('overnight-records'),
      this.storage.get<StanfordSleepinessData[]>('sleepiness-records'),
    ]);
    this.sleepRecords = (overnightRecords?.map((dataPt) => {
      return new OvernightSleepData(dataPt.sleepStart, dataPt.sleepEnd);
    })  ?? [])
    this.wakeRecords= (sleepinessRecords ?? [])
  }

  private makeOvernightChart(): void {
    const hourOffset : number = 20 * 60; //offset the chart from midnight, this shows starting at 8pm
    const canvas = document.getElementById('sleep-line-chart') as HTMLCanvasElement | null;
    const data = this.sleepRecords;

    if (!data || !canvas){
      return;
    }
    
    this.OvernightChart?.destroy();
    console.log(data);

    const labels = [];
    for (let i = 0; i < data.length; ++i) {
      labels.push(i.toString());
    }
    const firstSegments: [number, number][] = [];
    const secondSegments: ([number, number] | null)[] = [];

    for (const record of this.sleepRecords) {
      const bedtime = (record.bedTimeInMinutes() - hourOffset + 1440) % 1440;
      const wakeTime = (record.wakeupTimeInMinutes() - hourOffset + 1440) % 1440;

      if (wakeTime < bedtime) {
        firstSegments.push([bedtime, 1440]); //cut at end of day (24*60)
        secondSegments.push([0, wakeTime]); //continue at start of day
      } else {
        firstSegments.push([bedtime, wakeTime]); //push as normal
        secondSegments.push(null);
      }
    }


    if (canvas) {
      this.OvernightChart = new Chart(canvas, {
      type: 'bar',
      data: {
      labels: this.sleepRecords.map((_, index) => `Day ${index + 1}`),

      datasets: [
        {
          label: 'Time asleep',
          data: firstSegments,
          backgroundColor: '#5260ff',
          grouped: false,
        },
        {
          label: 'Time asleep',
          data: secondSegments,
          backgroundColor: '#5260ff',
          grouped: false,
        },
      ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          x: { //turn off the x ticks
            ticks: {display: false,},
            grid: {display: false,},
            title: {display: false,},
          },

          y: {
            type: 'linear',
            min: 0,
            max: 1440,

            ticks: {
              color: '#ACACB9', // ACACB9- passes WCAG AAA for large text and AA for small text
              stepSize: 120,
              callback: (value:any) =>
                OvernightSleepData.formatMinutes((Number(value) + hourOffset) % 1440),
            },

            
          },
        },
      }
      });
    } 
  }

  // this is for the cancel button in the clear data toast in stats.page.html
  public undoClearData(): void{
    console.log("clear data button clicked")
  }

}
