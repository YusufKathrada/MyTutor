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

  async ionViewWillEnter() {
    await this.presentLoading();
    await this.doRefresh(null);
    await this.dismissLoading();
  }

  async doRefresh(event) {
    this.userId = await this.storage.get('userId');

    // Get the 'events' (prac, tut, workshop, etc.) that the tutor has already signed up for
    let events = await this.tutor.getChosenEventsDetails(this.userId);

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

    console.log("events", events);
    this.sessions = this.formatEvents(events);
    console.log('tutor.events.sessions', this.sessions);
  }

  formatEvents(events: any) {
    let formattedEvents = [];
    for (let event of events) {
      let formattedEvent = {
        id: event.events.id,
        course: event.events.courses.name,
        eventType: event.events.typeOfSession.description,
        day: event.events.day,
        time: this.formatTime(event.events.startTime) + ' - ' + this.formatTime(event.events.endTime),
        venue: event.events.venue,
        attendanceCode: event.events.attendanceCode,
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
    if (session.attendanceCode === session.attendanceCodeInput) {
      console.log('Attendance code matched!');
      this.presentToast('Attendance logged!', 'warning');
    } else {
      console.log('Attendance code does not match.');
      this.presentToast('Attendance code does not match.', 'danger');
    }
  }
  

}
