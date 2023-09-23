import { Component, OnInit } from '@angular/core';
import { Student } from '../../providers/student';
import { TA } from '../../providers/ta';
import { LoadingController, ToastController, AlertController, Platform } from '@ionic/angular';
import { SupabaseService } from '../../../services/supabase.service';
import { AppComponent } from '../../app.component';

import { Admin } from '../../providers/admin';
import { Tutor } from '../../providers/tutor';
import { UserData } from '../../providers/user-data';

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
    private alertController: AlertController,
    private platform: Platform,
    private supabase: SupabaseService,
    private appComponent: AppComponent,
    private admin: Admin,
    private tutor: Tutor,
    private userData: UserData,
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

  async presentAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Are you sure you want to proceed with this choice?',
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
        this.updateApplicationResponse();
      }
    });

    await alert.present();
  }

  async updateApplicationResponse(){
    let status = await this.student.updateApplicationResponse(this.response, this.application.type, this.application.adminRights);

    if (status == 204 && this.response == 'accept') {
      this.presentToast('Response updated, please sign out and log in again to see updated pages', 'success', 5000);
      this.initializeApp();
    }
    else if (status == 204 && this.response == 'reject') {
      this.presentToast('Response updated', 'success');
      this.initializeApp();
    }
    else {
      this.presentToast('Error updating response', 'danger');
    }
  }

  async initializeApp() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    const userId = await this.userData.getUserId();

    try {
      const res = await this.supabase.getUserById(userId);
      let user = res[0];

      if(!user) {
        await this.toastController.create({
          message: 'User data not found in SAML assertion',
          duration: 2000,
          position: 'top',
        }).then(toast => toast.present());
        return;
      }

      const role = user.role;
      switch (role) {
        case 'admin':
          await this.admin.setRole('admin');
          break;
        case 'courseConvener':
          await this.admin.setRole('courseConvener');
          break;
        case 'tutor':
          await this.tutor.setRole('tutor');
          break;
        case 'student':
          await this.student.setRole('student');
          break;
        case 'ta':
          await this.student.setRole('ta');
          break;
        default:
          break;
      };

      this.userData.login(user.nameId);
      await this.appComponent.setMenu();

    } catch (error) {
      console.error("Error getting user by session: ", error);
    }

    await loading.dismiss();
    window.location.href = '/support';
  }

}
