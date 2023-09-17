import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Tutor } from '../../providers/tutor';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-select-times',
  templateUrl: './select-times.page.html',
  styleUrls: ['./select-times.page.scss'],
})
export class SelectTimesPage implements OnInit {

  private userId: string;

  sessions: any = [];
  chosenSessions: any = [];

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

    try {
      // Get the 'events' (prac, tut, workshop, etc.) that the tutor has already signed up for
      let chosenEvents: any = await this.tutor.getChosenEvents(this.userId);
      this.chosenSessions = chosenEvents.map((event) => {return event.events.id});

      // Get the 'events' (prac, tut, workshop, etc.) that the tutor can sign up for
      let events = await this.tutor.getTutorTimes(this.userId);
      this.sessions = this.formatEvents(events);
      console.log(this.sessions);

      // Sort by tutors needed
      this.sessions.sort((a, b) => (a.tutorsNeeded > b.tutorsNeeded) ? -1 : 1);

      if(this.sessions.length == 0) throw new Error('No assigned session(s)');
    } catch (error) {
      this.sessions = [
        {
          id: null,
          eventType: 'None',
          day: 'None',
          time: 'None',
          tutorsNeeded: 'N/A',
          full: true,
          status: 'Available',
        },
      ];
      this.presentToast('No assigned session(s)', 'danger');
    }
  }

  formatEvents(events: any) {
    let formattedEvents = [];
    for (let event of events) {
      const full = event.tutorsNeeded <= 0;
      const status = this.chosenSessions.includes(event.id) ? 'Joined' : 'Available';

      let formattedEvent = {
        id: event.id,
        eventType: event.typeOfSession.description,
        day: event.day,
        time: this.formatTime(event.startTime) + ' - ' + this.formatTime(event.endTime),
        tutorsNeeded: event.tutorsNeeded,
        full: full,
        status: status,
      }
      formattedEvents.push(formattedEvent);
    }
    return formattedEvents;
  }

  formatTime(time: string){
    return time.slice(0,5);
  }

  async joinEvent(session: any) {
    await this.presentLoading('Joining session...');
    console.log(session);
    try {
      let res = await this.tutor.joinEvent(session.id, this.userId);
      console.log('res', res);
      this.doRefresh(null);

      await this.presentToast('Joined session', 'success');
    } catch (error) {
      await this.presentToast('Error joining session', 'danger');
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
