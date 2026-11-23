import { SleepData } from './sleep-data';

export class OvernightSleepData extends SleepData {
	public sleepStart:Date;
	public sleepEnd:Date;

	constructor(sleepStart:Date, sleepEnd:Date) {
		super();
		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
	}

	override summaryString():string {
		var sleepStart_ms = this.sleepStart.getTime();
		var sleepEnd_ms = this.sleepEnd.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = sleepEnd_ms - sleepStart_ms;
		    
		// Convert to hours and minutes
		return Math.floor(difference_ms / (1000*60*60)) + " hours, " + Math.floor(difference_ms / (1000*60) % 60) + " minutes.";
	}

	override dateString():string {
		return "Night of " + this.sleepStart.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}

	public timeSleptInMinutes() :Number{
		var sleepStart_ms = this.sleepStart.getTime();
		var sleepEnd_ms = this.sleepEnd.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = sleepEnd_ms - sleepStart_ms;

		return Math.floor(difference_ms / (1000*60));
	}

	public bedTimeInMinutes(): number {
	return (
		this.sleepStart.getHours() * 60 +
		this.sleepStart.getMinutes()
	);
	}

	public wakeupTimeInMinutes(): number {
	return (
		this.sleepEnd.getHours() * 60 +
		this.sleepEnd.getMinutes()
	);
	}

	public crossesMidnight(): boolean {
	return (
		this.sleepStart.toDateString() !==
		this.sleepEnd.toDateString()
	);
	}

	public static formatMinutes(minutes: number): string {
	if (minutes === 1440) {
		return '12:00 AM';
	}

	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	return new Date(2000, 0, 1, hours, mins)
		.toLocaleTimeString([], {
		hour: 'numeric',
		minute: '2-digit',
		});
	}


}
