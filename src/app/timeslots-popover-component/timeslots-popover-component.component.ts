import { Component, Input, EventEmitter, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Admin } from '../providers/admin';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-timeslots-popover-component',
  templateUrl: './timeslots-popover-component.component.html',
  styleUrls: ['./timeslots-popover-component.component.scss'],
})
export class TimeslotsPopoverComponentComponent {

  @Input() showCourseEvents: any = [];
  @Input() eventId: number;


  constructor(
    private loadingCtrl: LoadingController,
    private admin: Admin,
    private toastCtrl: ToastController,


  ) { }

  ngOnInit(


  ) {}

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      color: color,
      duration: 2000
    });
    toast.present();
  }

  async deleteTutorFromEvent(eventId: number, userId: string) {
    let load = await this.loadingCtrl.create({
      message: 'Removing tutor from event...',
    });
    load.present();

    console.log('WE ARE HERE')
    console.log("eventId: ", eventId);
    console.log("tutorId: ", userId);
    let res = await this.admin.deleteTutorFromEvent(eventId, userId);

    load.dismiss();

    if (res === 204) {
      this.presentToast("Tutor removed from event successfully!", "success");
    }
    else {
      this.presentToast("Error removing tutor from event. Please try again.");
    }
    location.reload();
    // this.refreshEvents();
    // this.selectCourse({ detail: { value: this.course } });

  }

}
