import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Tutor } from '../../providers/tutor';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tutor-events',
  templateUrl: './tutor-events.page.html',
  styleUrls: ['./tutor-events.page.scss'],
})
export class TutorEventsPage implements OnInit {
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

  // Format the events to display in the table
  formatEvents(events: any) {
    let formattedEvents = [];
    for (let event of events) {
      let formattedEvent = {
        id: event.events.id,
        course: event.events.courses.name,
        eventType: event.events.typeOfSession.description,
        day: event.events.day,
        time: this.formatTime(event.events.startTime) + ' - ' + this.formatTime(event.events.endTime),
      }
      formattedEvents.push(formattedEvent);
    }
    return formattedEvents;
  }

  formatTime(time: string) {
    return time.slice(0,5);
  }

  // Remove the tutor from the event
  async removeEvent(session: any){
    await this.presentLoading('Removing session...');
    try {
      // Remove the tutor from the event
      let res = await this.tutor.removeEvent(session.id, this.userId);
      // Refresh the page
      this.doRefresh(null);

      await this.presentToast('Removed session', 'success');
    } catch (error) {
      await this.presentToast('Error removing session', 'danger');
      console.log(error);
    }

    await this.dismissLoading();
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


  // confirm alert to delete tutor from event
  async presentAlert(session: any) {
    const alert = await this.alertController.create({
      subHeader: 'Are you sure you want to delete this tutor from the event?',
      buttons: [
        {
          text: 'OK',
          role: 'ok'},
        {
          text: 'Cancel',
          role: 'cancel'}
        ],

    });

    //If selected 'OK' button then delete tutor from event by calling deleteTutuorFromEvent() function
    alert.onDidDismiss().then((data) => {
      if (data.role === 'ok') {
        this.removeEvent(session);
      }
    });

    await alert.present();
  }

}
