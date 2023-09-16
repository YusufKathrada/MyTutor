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
    courseAssigned: '',
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
    let app = await this.student.getTutorApplication();
    let res: any = await this.student.getTutorCourseAssigned();
    let courseAssigned = 'None';

    if (res.length)
      courseAssigned = res[0].courses.name;

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
    this.formatApplication(tempApp, courseAssigned);
  }

  formatApplication(application: any, courseAssigned: any) {
    console.log(application)
    this.application = {
      id: application.id,
      type: application.qualification ? 'TA' : 'Tutor',
      courseAssigned: courseAssigned,
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
    let status = await this.student.updateApplicationResponse(this.response, this.application.type);

    if (status == 204 && this.response == 'accept') {
      this.presentToast('Response updated, please sign out and log in again to see tutor pages', 'success', 5000);
    }
    else if (status == 204 && this.response == 'reject') {
      this.presentToast('Response updated', 'success');
    }
    else {
      this.presentToast('Error updating response', 'danger');
    }
  }

}
