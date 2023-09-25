import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Tutor } from '../../providers/tutor';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tutor-attendance',
  templateUrl: './tutor-attendance.page.html',
  styleUrls: ['./tutor-attendance.page.scss'],
})
export class TutorAttendancePage implements OnInit {
  screenWidth: number = this.platform.width();

  private userId: string;
  sessions: any[] = []

  constructor(
    private storage: Storage,
    private tutor: Tutor,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private platform: Platform,
    public alertController: AlertController,
  ) {
    this.platform.resize.subscribe(() => {
      this.screenWidth = this.platform.width();
    });
   }

  async ngOnInit() {
    console.log('tutor.events.ngOnInit');
  }

  // refresh the page
  async ionViewWillEnter() {
    await this.presentLoading();
    await this.doRefresh(null);
    await this.dismissLoading();
  }

  async doRefresh(event) {
    this.userId = await this.storage.get('userId');

    // Get the 'events' (prac, tut, workshop, etc.) that the tutor has already signed up for
    let events = await this.tutor.getChosenEventsDetails(this.userId);

    // If no events found, display a 'none' message
    if(!events.length) {
      this.sessions = [
        {
          id: null,
          course: 'None',
          eventType: 'None',
          day: 'None',
          time: 'None',
          tutorsNeeded: 'N/A',
          full: true,
          status: 'Available',
        },
      ];
      this.presentToast('No sessions found', 'danger');
      return;
    }

    this.sessions = this.formatEvents(events);
  }

  // format the events to display
  formatEvents(events: any) {
    let formattedEvents = [];
    for (let event of events) {
      let formattedEvent = {
        id: event.events.id,
        course: event.events.courses.name,
        eventType: event.events.typeOfSession.description,
        day: event.events.day,
        startTime: event.events.startTime,
        endTime: event.events.endTime,
        time: this.formatTime(event.events.startTime) + ' - ' + this.formatTime(event.events.endTime),
        venue: event.events.venue,
        attendanceCode: event.events.attendancecode,
        attendanceCodeInput: '',
      }
      formattedEvents.push(formattedEvent);
    }
    return formattedEvents;
  }

  formatTime(time: string) {
    return time.slice(0,5);
  }

  async presentLoading(message: string = null) {
    const loading = await this.loadingController.create({
      message: message ? message : 'Loading...',
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 2000,
    });
    await toast.present();
  }

  async checkAttendance(session: any) {
    // Check if attendance code matches
    if (session.attendanceCode === session.attendanceCodeInput) {

      // Check if its the correct time to log attendance
      if(this.validateAttendancetime(session)){
        await this.presentLoading('Logging attendance...');

        // Log attendance with session id and user id
        let status = await this.tutor.updateAttendance(session.id, this.userId);

        await this.dismissLoading();
        if(status == 204) {
          this.presentToast('Attendance already logged for this event', 'warning');
        }
        else{
          this.presentToast('Attendance logged!', 'success');
        }
      }

    } else {
      console.log('Attendance code does not match');
      this.presentToast('Incorrect attendance code', 'danger');
    }
  }

  validateAttendancetime(session: any) {
    const now = new Date();
    // Get the current day (of the week)
    const currentDay = now.toLocaleString('en-us', { weekday: 'long' });
    // Get the current time for UCT+2 (SA Timezone) in terms of seconds
    const currentTime = (now.getUTCHours()+2) * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();

    // Check if its the correct day
    if(session.day !== currentDay) {
      console.log('Wrong day.');
      this.presentToast('Attendance unavailable for this day.', 'danger');
      return false;
    }

    // Construct Date objects in UTC to compare times
    const [startHours, startMinutes, startSeconds] = session.startTime.split(':').map(Number);
    const [endHours, endMinutes, endSeconds] = session.endTime.split(':').map(Number);

    const startTotalSeconds = startHours * 3600 + startMinutes * 60 + startSeconds;
    const endTotalSeconds = endHours * 3600 + endMinutes * 60 + endSeconds + (10 * 60); // Add 10 minutes to end time

    // Check if its within the correct times
    if(currentTime < startTotalSeconds) {
      this.presentToast('Attendance not open', 'danger');
      return false;
    } else if(currentTime > endTotalSeconds) {
      this.presentToast('Attendance closed', 'danger');
      return false;
    }
    return true;
  }
}
