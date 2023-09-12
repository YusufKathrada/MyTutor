import { Component, OnInit } from '@angular/core';
import { Admin } from '../../providers/admin';
import { LoadingController, ToastController } from '@ionic/angular';

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

  tutApps: any = [];
  taApps: any = [];

  displayedTutors: any = [];
  displayedTAs: any = [];

  tutorStatusMap: any = [];
  taStatusMap: any = [];

  constructor(
    public admin: Admin,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    await this.presentLoading();

    this.segment = 'tutor';

    this.tutApps = await this.admin.getTutorApplications();
    this.taApps = await this.admin.getTAApplications();

    await this.getAndFormatApplications();

    this.displayedTutors = await this.getDisplayedTutors();
    this.displayedTAs = await this.getDisplayedTAs();

    this.applicationStatus = await this.admin.getStatuses();

    this.statusMap = this.applicationStatus.reduce((map, obj) => {
      map[obj.description] = obj.id;
      return map;
    }, {});

    // console.log('statusMap: ', this.statusMap);
    // console.log('applicationStatus: ', this.applicationStatus);


    // console.log('tutApps: ', this.tutApps);
    // console.log('taApps: ', this.taApps);


    // console.log('tutorApplications: ', this.tutorApplications);
    // console.log('taApplications: ', this.taApplications);

    // console.log('displayedTutors: ', this.displayedTutors);
    // console.log('displayedTAs: ', this.displayedTAs);


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

    this.tutorApplications = this.tutApps.map((application) => {
      return {
        id: application.id,
        studentName: `${application.name} ${application.surname}`,
        stuNum: application.stuNum,
        degree: application.degree,
        yearOfStudy: application.yearOfStudy,
        average: application.average,
        status: application.statusId,
        userId: application.userId
      };
    });

    this.taApplications = this.taApps.map((application) => {
      return {
        id: application.id,
        name: `${application.name} ${application.surname}`,
        email: application.email,
        qualification: application.qualification,
        desiredCourse: application.preferredCourse,
        status: application.statusId,
        userId: application.userId
      };
    });
  }

  async updateTutors(){
    console.log('tutorApplications: ', this.tutorApplications)

    this.presentLoading();
    let success: boolean = true;
    for (const application of this.tutorApplications) {
      const role = application.status === 'Accepted' ? 'tutor' : 'student';

      let res = await this.admin.updateApplicationStatus(application.id, this.statusMap[application.status], application.userId, role);
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

    this.ngOnInit();
  }

  async updateTAs(){
    console.log('taApplications: ', this.taApplications)

    this.presentLoading();
    let success: boolean = true;
    for (const application of this.taApplications) {
      // TODO: Update role of ta appropiately
      let res = await this.admin.updateApplicationStatus(application.id, this.statusMap[application.status], application.userId, 'student');
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

    this.ngOnInit();
  }

  async getDisplayedTutors(){

    const pendingTutors: any = [];
    //Only want to displayed pending applications
    for (const application of this.tutorApplications) {
      if (application.status !== 0 && application.status !== 2) {
        pendingTutors.push(application);
      }
    }
    return pendingTutors;
  }

  async getDisplayedTAs(){

    const pendingTAs: any = [];
    //Only want to displayed pending applications
    for (const application of this.taApplications) {
      if (application.status !== 0 && application.status !== 2) {
        pendingTAs.push(application);
      }
    }
    return pendingTAs;
  }
}
