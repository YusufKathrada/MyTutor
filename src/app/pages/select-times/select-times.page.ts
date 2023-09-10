import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Tutor } from '../../providers/tutor';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-select-times',
  templateUrl: './select-times.page.html',
  styleUrls: ['./select-times.page.scss'],
})
export class SelectTimesPage implements OnInit {

  private userId: string;

  sessions: any = [];

  constructor(
    private storage: Storage,
    private tutor: Tutor,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await this.doRefresh(null);
  }

  async doRefresh(event) {
    this.userId = await this.storage.get('userId');
    let events = await this.tutor.getTutorTimes(this.userId);
    this.sessions = this.formatEvents(events);
    console.log(this.sessions);

    this.sessions.sort((a, b) => (a.tutorsNeeded > b.tutorsNeeded) ? -1 : 1);
  }

  formatEvents(events: any) {
    let formattedEvents = [];
    for (let event of events) {
      const full = event.tutorsNeeded <= 0;
      let formattedEvent = {
        id: event.id,
        eventType: event.typeOfSession.description,
        day: event.day,
        time: this.formatTime(event.startTime) + ' - ' + this.formatTime(event.endTime),
        tutorsNeeded: event.tutorsNeeded,
        full: full,
      }
      formattedEvents.push(formattedEvent);
    }
    return formattedEvents;
  }

  formatTime(time: string){
    return time.slice(0,5);
  }

  async joinEvent(session: any) {
    await this.presentLoading();
    console.log(session);
    let res = await this.tutor.joinEvent(session.id, this.userId);
    console.log(res);
    this.doRefresh(null);
    await this.dismissLoading();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Joining Session...',
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }
}
