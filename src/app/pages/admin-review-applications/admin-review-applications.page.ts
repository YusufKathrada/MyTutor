import { Component, OnInit } from '@angular/core';
import { Admin } from '../../providers/admin';
import { LoadingController, ToastController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-admin-review-applications',
  templateUrl: './admin-review-applications.page.html',
  styleUrls: ['./admin-review-applications.page.scss'],
})
export class AdminReviewApplicationsPage implements OnInit {

  screenWidth: number = this.platform.width();

  public segment: string = '';
  public filterOption: string = 'all';
  minimumMark: number = 0;

  fullTutorApplications: any = [];
  fullTAApplications: any = [];

  formattedTutorApplications: any = [];
  formattedTAApplications: any = [];

  acceptedTutors: any = [];
  pendingTutors: any = [];
  rejectedTutors: any = [];

  acceptedTAs: any = [];
  pendingTAs: any = [];
  rejectedTAs: any = [];

  applicationStatuses: any = [];
  statusMap: any;
  revStatusMap: any = [];

  // displayedTutors: any = [];
  // displayedTAs: any = [];

  constructor(
    public admin: Admin,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public platform: Platform
  ) {
    this.platform.resize.subscribe(() => {
      this.screenWidth = this.platform.width();
    });
  }

  async ngOnInit() {
    console.log('AdminReviewApplicationsPage.events.ngOnInit');

    // await this.presentLoading();

    //this.applicationStatuses = await this.admin.getStatuses();

    // this.statusMap = this.applicationStatuses.reduce((map, obj) => {
    //   map[obj.description] = obj.id;
    //   return map;
    // }, {});

    // this.revStatusMap = this.applicationStatuses.reduce((map, obj) => {
    //   map[obj.id] = obj.description;
    //   return map;
    // }, {});



    // console.log('statusMap: ', this.statusMap);

    // console.log('RevstatusMap: ', this.revStatusMap);

     this.segment = 'tutor';

    // this.fullTutorApplications = await this.admin.getTutorApplications();
    // this.fullTAApplications = await this.admin.getTAApplications();



    // await this.getAndFormatApplications();

    // // this.displayedTutors = await this.getDisplayedTutors();
    // // this.displayedTAs = await this.getDisplayedTAs();

    // console.log('fullTutorApps', this.fullTutorApplications);
    // console.log('fullTAAplications', this.fullTAApplications);


    // console.log('formattedTutorApplications: ', this.formattedTutorApplications);
    // console.log('formattedTAApplications: ', this.formattedTAApplications);

    // // console.log('displayedTutors: ', this.displayedTutors);
    // // console.log('displayedTAs: ', this.displayedTAs);


    // console.log('acceptedTutors: ', this.acceptedTutors);
    // console.log('pendingTutors: ', this.pendingTutors);
    // console.log('rejectedTutors: ', this.rejectedTutors);

    // console.log('acceptedTAs: ', this.acceptedTAs);
    // console.log('pendingTAs: ', this.pendingTAs);
    // console.log('rejectedTAs: ', this.rejectedTAs);


    // await this.loadingCtrl.dismiss();
  }
  async ionViewWillEnter() {
    await this.presentLoading();
    await this.doRefresh(null);
    await this.dismissLoading();
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

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      color: color,
      duration: 2000
    });
    toast.present();
  }

  async getAndFormatApplications(){

    this.formattedTutorApplications = this.fullTutorApplications.map((application) => {
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

    this.rejectedTutors = this.formattedTutorApplications.filter((application) => application.status === 0);
    this.pendingTutors = this.formattedTutorApplications.filter((application) => application.status === 1);
    this.acceptedTutors = this.formattedTutorApplications.filter((application) => application.status === 2);


    this.formattedTAApplications = this.fullTAApplications.map((application) => {
      return {
        id: application.id,
        name: `${application.name} ${application.surname}`,
        email: application.email,
        qualification: application.qualification,
        desiredCourse: application.preferredCourse,
        status: application.statusId,
        userId: application.userId,
        adminRights: application.adminRights && application.statusId === 2 ? true : false,
        checkboxEnabled: this.isCheckboxEnabled(this.revStatusMap[application.status])
      };
    });

    this.rejectedTAs = this.formattedTAApplications.filter((application) => application.status === 0);
    this.pendingTAs = this.formattedTAApplications.filter((application) => application.status === 1);
    this.acceptedTAs = this.formattedTAApplications.filter((application) => application.status === 2);

  }

  async updateTutors(){
    console.log('tutorApplications: ', this.formattedTutorApplications)

    this.presentLoading();
    let success: boolean = true;
    for (const application of this.formattedTutorApplications) {
      let res = await this.admin.updateApplicationStatus(application.id, this.statusMap[application.status], application.userId);
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

    this.filterOption = 'all';
    this.ngOnInit();
  }


  async updateTAs(){
    console.log('taApplications: ', this.formattedTAApplications)

    this.presentLoading();
    let success: boolean = true;
    for (const application of this.formattedTAApplications) {

    console.log('application: ', application);
      let res = await this.admin.updateApplicationStatus(application.id, this.statusMap[application.status], application.userId, application.adminRights);
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

    this.filterOption = 'all';
    this.ngOnInit();
  }

  isCheckboxEnabled(status: string): boolean {
    return status === 'Accepted';
  }

  async applyTutorFilter(){
    this.getAndFormatApplications();

    switch (this.filterOption) {
      case 'all':
        this.getAndFormatApplications();
        break;
      case 'accepted':
        this.formattedTutorApplications = this.acceptedTutors;
        break;
      case 'pending':
        this.formattedTutorApplications = this.pendingTutors;
        break;
      case 'rejected':
        this.formattedTutorApplications = this.rejectedTutors;
        break;
      default:
        break;
    }
  }


  async applyTAFilter(){
    this.getAndFormatApplications();

    switch (this.filterOption) {
      case 'all':
        this.getAndFormatApplications();
        break;
      case 'accepted':
        this.formattedTAApplications = this.acceptedTAs;
        break;
      case 'pending':
        this.formattedTAApplications = this.pendingTAs;
        break;
      case 'rejected':
        this.formattedTAApplications = this.rejectedTAs;
        break;
      default:
        break;
    }
  }

  viewTranscript(userId){
    const url = `${environment.supabaseUrl}/storage/v1/object/public/transcripts/${userId}/doc.pdf`;
    window.open(url, '_blank');
  }
  // reloadPage() {
  //   this.formattedTutorApplications = [...this.fullTutorApplications];
  //   this.formattedTAApplications = [...this.fullTAApplications];
  // }
  async doRefresh(event: any) {
    try {
      // Uncomment the code you want to execute during the refresh here
      // For example:
  
      this.applicationStatuses = await this.admin.getStatuses();
  
      this.statusMap = this.applicationStatuses.reduce((map, obj) => {
        map[obj.description] = obj.id;
        return map;
      }, {});
  
      this.revStatusMap = this.applicationStatuses.reduce((map, obj) => {
        map[obj.id] = obj.description;
        return map;
      }, {});
  
      this.segment = 'tutor';
  
      this.fullTutorApplications = await this.admin.getTutorApplications();
      this.fullTAApplications = await this.admin.getTAApplications();
  
      await this.getAndFormatApplications();
  
      console.log('fullTutorApps', this.fullTutorApplications);
      console.log('fullTAAplications', this.fullTAApplications);
  
      console.log('formattedTutorApplications: ', this.formattedTutorApplications);
      console.log('formattedTAApplications: ', this.formattedTAApplications);
  
      console.log('acceptedTutors: ', this.acceptedTutors);
      console.log('pendingTutors: ', this.pendingTutors);
      console.log('rejectedTutors: ', this.rejectedTutors);
  
      console.log('acceptedTAs: ', this.acceptedTAs);
      console.log('pendingTAs: ', this.pendingTAs);
      console.log('rejectedTAs: ', this.rejectedTAs);
  
      // ... (Uncomment any other code you need for refresh)
  
      if (event) {
        // If an event is provided, complete the refresh animation
        event.target.complete();
      }
    } catch (error) {
      console.error('Error while refreshing:', error);
  
      if (event) {
        // If an event is provided and there was an error, complete the refresh animation with an error message
        event.target.complete();
      }
    }
  }
  
  

//   filterApplicationsByMinimumMark() {
//     // Filter formattedTutorApplications based on the minimum mark
//     this.formattedTutorApplications = this.formattedTutorApplications.filter(
//       (application) => application.average >= this.minimumMark
//     );
// }
}

  // async getDisplayedTutors(){
  //   const pendingTutors: any = [];
  //   //Only want to displayed pending applications
  //   for (const application of this.tutorApplications) {
  //     console.log(this.revStatusMap[application.status]);
  //     if (application.status !== 0 && application.status !== 2) {
  //       pendingTutors.push(application);
  //     }
  //   }
  //   return pendingTutors;
  // }

  // async getDisplayedTAs(){

  //   const pendingTAs: any = [];
  //   //Only want to displayed pending applications
  //   for (const application of this.taApplications) {
  //     if (application.status !== 0 && application.status !== 2) {
  //       pendingTAs.push(application);
  //     }
  //   }
  //   return pendingTAs;
  // }



