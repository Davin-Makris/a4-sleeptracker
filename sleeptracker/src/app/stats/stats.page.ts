import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonCardHeader, 
  IonCardTitle, IonButton, IonToast} from '@ionic/angular/standalone';
import Chart from "chart.js/auto"
import 'chartjs-adapter-luxon';

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
  private DayChart?: Chart;

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
    this.makeCharts();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.fetchRecords();
    this.makeCharts();
  }

  private makeCharts(): void {
    this.makeDayChart();
    this.makeOvernightChart();
  }

  private async fetchRecords(): Promise<boolean> {
    const [overnightRecords, sleepinessRecords] = await Promise.all([
      this.storage.get<OvernightSleepData[]>('overnight-records'),
      this.storage.get<StanfordSleepinessData[]>('sleepiness-records'),
    ]);
    this.sleepRecords = (overnightRecords?.map((dataPt) => {
      return new OvernightSleepData(dataPt.sleepStart, dataPt.sleepEnd);
    })  ?? [])
    this.wakeRecords= (sleepinessRecords?.map((dataPT) => new StanfordSleepinessData(dataPT.loggedValue, dataPT.loggedAt)) ?? [])

    if (this.sleepRecords.length + this.wakeRecords.length == 0){
      return false;
    }

    return true;
  }

  private makeDayChart(): void {
    const canvas = document.getElementById('day-chart') as HTMLCanvasElement | null;
    const data = this.wakeRecords;

    if (!data || !canvas){
      return;
    }

    this.DayChart?.destroy();

    this.DayChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.wakeRecords.map((dataPT) => dataPT.loggedAt),

        datasets: [
          {
            label: 'Restfulness',
            data: this.wakeRecords.map((dataPT) => dataPT.loggedValue)
          }
        ]
      },
      options: {
        plugins: {legend: {display: false,},},
        
        scales: {
          x: {
            type: 'time',
            ticks: {color: '#ACACB9',}, // ACACB9- passes WCAG AAA for large text and AA for small text
            time: {
              // Luxon format string
              tooltipFormat: 'MMM D h:mm a'
            },
            title: {display: false,}
          },
          y: {
            title: {display: false,},
            min:0,
            max: 8,
            
            ticks: {stepSize: 1, color: '#ACACB9',} // ACACB9- passes WCAG AAA for large text and AA for small text
          }
        },
      }
    })
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
        plugins: {legend: {display: false,},},

        scales: {
          x: { //turn off the x ticks
            ticks: {display: false,},
            grid: {display: false,},
            title: {display: false,},
          },

          y: { //translate the y ticks from minutes to a time
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

  private loadDummyData(){
    const sleepKey = 'overnight-records';
    const dayKey = "sleepiness-records";

    for (var i = 14; i > 0; ++i){
      var startTime = new Date();
      startTime = new Date(startTime.getDate() - i)
      startTime.setHours(20 + Math.random() * (6 * 60 * 60 * 1000));
      var endTime = new Date(startTime.getDate()).setHours(startTime.getHours() + Math.random() * (10 * 60 * 60 * 1000));
    }
    
    this.sleepRecords = [];
  }

  private getRandomDate(start: Date, end: Date): Date {
    const startMs = start.getTime();
    const endMs = end.getTime();
    const randomMs = startMs + Math.random() * (endMs - startMs);
    return new Date(randomMs);
  }

  // this is for the cancel button in the clear data toast in stats.page.html
  public undoClearData(): void{
    console.log("clear data button clicked")
  }

}
