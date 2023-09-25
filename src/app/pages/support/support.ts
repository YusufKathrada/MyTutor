import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OnInit } from '@angular/core';
import { UserData } from '../../providers/user-data';
import { AlertController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
  styleUrls: ['./support.scss'],
})
export class SupportPage implements OnInit{
  submitted = false;
  supportMessage: string;
  userRole: string;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public userData: UserData,
    public loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {

    await this.presentLoading();
    this.userRole = await this.userData.getRole();
    //console.log('userRole: ', this.userRole);

    // Add a delay of 2 seconds before dismissing the loading
    setTimeout(async () => {
      await this.dismissLoading();
  }, 1500);
  }

  async dismissLoading() {
    await this.loadingCtrl.dismiss();
  }


  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loading.present();
  }
}
