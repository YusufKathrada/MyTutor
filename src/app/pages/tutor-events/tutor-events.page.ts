import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Tutor } from '../../providers/tutor';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tutor-events',
  templateUrl: './tutor-events.page.html',
  styleUrls: ['./tutor-events.page.scss'],
})
export class TutorEventsPage implements OnInit {

  private userId: string;
  sessions: any[] = []

  constructor(
    private storage: Storage,
    private tutor: Tutor,
    private loadingController: LoadingController,
    private toastController: ToastController,
  ) { }

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
      }
      formattedEvents.push(formattedEvent);
    }
    return formattedEvents;
  }

  formatTime(time: string) {
    return time.slice(0,5);
  }

  async removeEvent(session: any){
    await this.presentLoading('Removing session...');
    console.log(session);
    try {
      let res = await this.tutor.removeEvent(session.id, this.userId);
      console.log('res', res);
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

}
