import { Component, OnInit } from '@angular/core';
import { Student } from '../../providers/student';
import { TA } from '../../providers/ta';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-view-application-status',
  templateUrl: './view-application-status.page.html',
  styleUrls: ['./view-application-status.page.scss'],
})
export class ViewApplicationStatusPage implements OnInit {

  screenWidth: number = this.platform.width();

  application: any = {
    type: '',
    status: '',
    courseAssigned: '',
  };
  response: any;

  constructor(
    private student: Student,
    private ta: TA,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private platform: Platform,
  ) {
    this.platform.resize.subscribe(() => {
      this.screenWidth = this.platform.width();
    });
   }

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
    let app = await this.student.getTutorApplication();



    if(!app.length) {
      this.application = {
        type: 'None',
        status: 'None',
        courseAssigned: 'None',
      }
      await this.presentToast('No application found', 'danger');
      return;
    }

    let tempApp = app[0];

    let res: any;
    let courseAssigned = 'None';
    if(tempApp.qualification) {
      res = await this.ta.getTACourseAssigned();
    }
    else {
      res = await this.student.getTutorCourseAssigned();
    }

    if (res.length)
      courseAssigned = res[0].courses.name;

    this.formatApplication(tempApp, courseAssigned);
  }

  formatApplication(application: any, courseAssigned: any) {
    console.log(application)
    this.application = {
      id: application.id,
      type: application.qualification ? 'TA' : 'Tutor',
      courseAssigned: courseAssigned,
      adminRights: application.adminRights,
      status: application.status.description,
    }
    this.response = application.response;
  }

  async presentToast(message: string, color: string, duration?: number) {
    let toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 2000,
      color: color,
    });
    toast.present();
  }

  async updateApplicationResponse(){
    let status = await this.student.updateApplicationResponse(this.response, this.application.type, this.application.adminRights);

    if (status == 204 && this.response == 'accept') {
      this.presentToast('Response updated, please sign out and log in again to see updated pages', 'success', 5000);
    }
    else if (status == 204 && this.response == 'reject') {
      this.presentToast('Response updated', 'success');
    }
    else {
      this.presentToast('Error updating response', 'danger');
    }
  }

}
