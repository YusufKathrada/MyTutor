import { Component, Input, EventEmitter, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Admin } from '../providers/admin';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


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
    public alertController: AlertController,


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

    let res = await this.admin.deleteTutorFromEvent(eventId, userId);

    load.dismiss();

    if (res === 204) {
      this.presentToast("Tutor removed from event successfully!", "success");
    }
    else {
      this.presentToast("Error removing tutor from event. Please try again.");
    }
    //implement better refresh
    location.reload();

  }

  async presentAlert(eventId: number, userId: string) {
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
        this.deleteTutorFromEvent(eventId, userId);
      }
    });

    await alert.present();
  }

}
