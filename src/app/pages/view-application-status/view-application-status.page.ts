import { Component, OnInit } from '@angular/core';
import { Student } from '../../providers/student';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-view-application-status',
  templateUrl: './view-application-status.page.html',
  styleUrls: ['./view-application-status.page.scss'],
})
export class ViewApplicationStatusPage implements OnInit {

  application: any = {
    type: '',
    status: '',
  };
  response: any;

  constructor(
    private student: Student,
    private loadingController: LoadingController,
    private toastController: ToastController,
  ) { }

  async ngOnInit() {
    await this.presentLoading();
    await this.getCurrentApplication();
    this.dismissLoading();
  }

  async ionViewWillEnter() {
    await this.getCurrentApplication();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();
  }

  dismissLoading() {
    this.loadingController.dismiss();
  }

  async getCurrentApplication() {
    let res = await this.student.getTutorApplication();
    let tempApp = res[0];
    this.formatApplication(tempApp);
  }

  formatApplication(application: any) {
    this.application = {
      type: application.qualification ? 'TA' : 'Tutor',
      status: application.status.description,
    }
    this.response = application.response;
  }

  async presentToast(message: string, color: string) {
    let toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }

  async updateApplicationResponse(){
    let status = await this.student.updateApplicationResponse(this.response);

    if (status == 204) {
      this.presentToast('Response updated', 'success');
    }
    else {
      this.presentToast('Error updating response', 'danger');
    }
  }

}
