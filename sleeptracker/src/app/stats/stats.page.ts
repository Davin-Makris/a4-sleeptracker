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
import { timeout } from 'rxjs';

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

  tempSleepRecords: OvernightSleepData[] = [];
  tempWakeRecords: StanfordSleepinessData[] = [];

  // this is the cancel button for the clear data ion-toast in stats.page.html
   toastButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.undoClearData();
        this.makeCharts();
      },
    },
  ];

  constructor(private storage: SleepStorageService) {}

  ngOnInit() {
    
  }

  async clearData(): Promise<void> {
    var emptyRecords = await this.fetchRecords();
    if (emptyRecords){
      console.log("loading dummy data");
      await this.loadDummyData();
    }
    else {
      this.tempSleepRecords = this.sleepRecords;
      this.tempWakeRecords = this.wakeRecords;
      await this.storage.reset();
      this.sleepRecords = [];
      this.wakeRecords = [];
    }
    this.makeCharts();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.fetchRecords();
    this.makeCharts();

    setTimeout(async () => {
      const sleep = await this.storage.get<OvernightSleepData[]>(
        'overnight-records'
      ) ?? [];

      const wake = await this.storage.get<StanfordSleepinessData[]>(
        'sleepiness-records'
      ) ?? [];

      if (
        sleep.length !== this.sleepRecords.length ||
        wake.length !== this.wakeRecords.length
      ) {
        await this.fetchRecords();
        this.makeCharts();
      }
    }, 3000); //check if theres any changes from the last page 3 seconds after loading

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
    return (this.sleepRecords.length + this.wakeRecords.length == 0);
    
  }

  private makeDayChart(): void {
    const canvas = document.getElementById('day-chart') as HTMLCanvasElement | null;
    const data = this.wakeRecords.slice(-14);

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
              tooltipFormat: 'MMM d h:mm a'
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
    const data = this.sleepRecords.slice(-14);

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

  private async loadDummyData(){
    const sleepKey = 'overnight-records';
    const dayKey = "sleepiness-records";

    for (var i = 14; i > 0; --i){
      const day = new Date()
      day.setDate(day.getDate() - i);
      var startTime = new Date(day);
      startTime.setHours(20  + Math.random() * (6), Math.random() * 60); //random time between 8pm and 2am
      var endTime:Date = new Date(startTime)
      endTime.setHours(startTime.getHours() + Math.random() * (4) + 6, Math.random() * 60); //sleep for a random time between 6 and 10 hours after start time
      this.sleepRecords.push(new OvernightSleepData(startTime, endTime));

      var loggedTime = new Date(day);
      loggedTime.setHours(8 + Math.random() * 16, Math.random() * 60);
      var loggedValue = Math.floor(Math.random() * (7) + 1);

      this.wakeRecords.push(new StanfordSleepinessData(loggedValue, loggedTime));
    }
    await this.storage.set(sleepKey, this.sleepRecords);
    await this.storage.set(dayKey, this.wakeRecords);
  }

 

  // this is for the cancel button in the clear data toast in stats.page.html
  public async undoClearData(): Promise<void>{
    const sleepKey = 'overnight-records';
    const dayKey = "sleepiness-records";

    console.log("clear data button clicked");
    this.sleepRecords = this.tempSleepRecords;
    this.wakeRecords = this.tempWakeRecords;
    await this.storage.set(sleepKey, this.sleepRecords);
    await this.storage.set(dayKey, this.wakeRecords);
  }

}
