import { Component, OnInit } from '@angular/core';
import { Admin } from '../../providers/admin';
import { LoadingController, ToastController } from '@ionic/angular';
import { stat } from 'fs';

@Component({
  selector: 'app-admin-review-applications',
  templateUrl: './admin-review-applications.page.html',
  styleUrls: ['./admin-review-applications.page.scss'],
})
export class AdminReviewApplicationsPage implements OnInit {

  public segment: string = '';

  tutorApplications: any = [];
  taApplications: any = [];
  applicationStatus: any = [];
  statusMap: any;


  constructor(
    public admin: Admin,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    await this.presentLoading();

    this.segment = 'tutor';

    this.applicationStatus = await this.admin.getStatuses();
    this.statusMap = this.applicationStatus.reduce((map, obj) => {
      map[obj.description] = obj.id;
      return map;
    }, {});
    console.log('applicationStatus: ', this.applicationStatus);

    await this.getAndFormatApplications();

    await this.loadingCtrl.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loading.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      color: color,
      duration: 2000
    });
    toast.present();
  }

  async getAndFormatApplications(){
    let [tutorApps, taApps] = await this.admin.getApplications();

    this.tutorApplications = tutorApps.map((application) => {
      return {
        id: application.id,
        studentName: `${application.name} ${application.surname}`,
        stuNum: application.stuNum,
        degree: application.degree,
        yearOfStudy: application.yearOfStudy,
        average: application.average,
        status: application.statusId
      };
    });

    this.taApplications = taApps.map((application) => {
      return {
        id: application.id,
        name: `${application.name} ${application.surname}`,
        email: application.email,
        qualification: application.qualification,
        desiredCourse: application.preferredCourse,
        status: application.statusId
      };
    });
  }

  async updateTutors(){
    console.log('tutorApplications: ', this.tutorApplications)

    this.presentLoading();
    let success: boolean = true;
    for (const application of this.tutorApplications) {
      let res = await this.admin.updateApplicationStatus(application.id, this.statusMap[application.status]);
      if (res !== 204) {
        success = false;
        break;
      }
    }
    this.loadingCtrl.dismiss();

    if (success) {
      this.presentToast('Successfully updated applications', 'success');
    } else {
      this.presentToast('Failed to update applications', 'danger');
    }
  }

  async updateTAs(){
    console.log('taApplications: ', this.taApplications)

    this.presentLoading();
    let success: boolean = true;
    for (const application of this.taApplications) {
      let res = await this.admin.updateApplicationStatus(application.id, this.statusMap[application.status]);
      if (res !== 204) {
        success = false;
        break;
      }
    }
    this.loadingCtrl.dismiss();

    if (success) {
      this.presentToast('Successfully updated applications', 'success');
    }
    else {
      this.presentToast('Failed to update applications', 'danger');
    }
  }
}
