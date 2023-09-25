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
  showFilterInput = false;

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

  removedApplications: any=[];

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

     this.segment = 'tutor';
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

  // Format the application data to be displayed in the table
  async getAndFormatApplications(){

    this.formattedTutorApplications = this.fullTutorApplications.map((application) => {
      return {
        id: application.id,
        studentName: `${application.name} ${application.surname}`,
        stuNum: application.stuNum,
        degree: application.degree,
        yearOfStudy: application.yearOfStudy,
        average: application.average,
        status: this.revStatusMap[application.statusId],
        userId: application.userId
      };
    });

    this.rejectedTutors = this.formattedTutorApplications.filter((application) => application.status === 'Rejected');
    this.pendingTutors = this.formattedTutorApplications.filter((application) => application.status === 'Pending');
    this.acceptedTutors = this.formattedTutorApplications.filter((application) => application.status === 'Accepted');


    this.formattedTAApplications = this.fullTAApplications.map((application) => {
      return {
        id: application.id,
        name: `${application.name} ${application.surname}`,
        email: application.email,
        qualification: application.qualification,
        desiredCourse: application.preferredCourse,
        status: this.revStatusMap[application.statusId],
        userId: application.userId,
        adminRights: application.adminRights && application.statusId === 2 ? true : false,
        checkboxEnabled: this.isCheckboxEnabled(this.revStatusMap[application.status])
      };
    });

    this.rejectedTAs = this.formattedTAApplications.filter((application) => application.status === 'Rejected');
    this.pendingTAs = this.formattedTAApplications.filter((application) => application.status === 'Pending');
    this.acceptedTAs = this.formattedTAApplications.filter((application) => application.status === 'Accepted');
  }


  async updateTutors(){

    this.presentLoading();
    let success: boolean = true;
    // Loop through the formattedTutorApplications and update the status of each application
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
    this.ionViewWillEnter();
  }


  async updateTAs(){

    this.presentLoading();
    let success: boolean = true;
    // Loop through the formattedTAApplications and update the status of each application
    for (const application of this.formattedTAApplications) {

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
    this.ionViewWillEnter();
  }

  openFilterInput() {
    this.minimumMark=0;
    this.showFilterInput = !this.showFilterInput; // Show the filter input section
  }

  async filterMark() {
    // Validate if minimumMark is a valid number
    if (isNaN(this.minimumMark) || this.minimumMark < 0 || this.minimumMark > 100 || !Number.isInteger(this.minimumMark)) {
      this.presentToast('Please enter a valid integer between 0 and 100.', 'danger');
      console.log("Invalid input, must be an integer between 0 and 100");
      return;
    }
    // Create an array to temporarily store removed applications


    // Loop through the fullTutorApplications and update average property accordingly
    for (let i = this.fullTutorApplications.length - 1; i >= 0; i--) {
      const application = this.fullTutorApplications[i];
      application.average = parseFloat(application.average); // Ensure average is a numeric value

      if (application.average < this.minimumMark) {
        // Remove the application from the fullTutorApplications array and add it to the removedApplications array
        this.removedApplications.push(this.fullTutorApplications.splice(i, 1)[0]);
      }
    }

    // Check if applications in removedApplications should be added back based on the new minimumMark
    // Check if there are removed applications
if (this.removedApplications.length > 0) {
  // Loop through the removed applications
  for (let i = this.removedApplications.length - 1; i >= 0; i--) {
    const application = this.removedApplications[i];
    const average = parseFloat(application.average);

    // Check if the application's average is greater than or equal to the new minimum mark
    if (average >= this.minimumMark) {
      // Add the application back to fullTutorApplications
      this.fullTutorApplications.push(application);
      // Remove the application from the removedApplications array
      this.removedApplications.splice(i, 1);
    }
  }
}



    // Update the displayed applicants based on the current filter option
    this.applyTutorFilter();
    //this.filterOption = 'all';
    //this.ngOnInit();
    //this.showFilterInput = false;

    // You may want to save the changes to the server here if necessary.
  }


  isCheckboxEnabled(status: string): boolean {
    return status === 'Accepted';
  }

  async applyTutorFilter(){
   // console.log('Applying tutor filter');
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

  // refresh the page
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

      this.minimumMark = 0;
      this.showFilterInput=false;


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

  getColorClass(status: string): string {
    switch (status) {
      case 'Accepted':
        return 'green-background';
      case 'Pending':
        return 'orange-background';
      case 'Rejected':
        return 'red-background';
      default:
        return '';
    }
  }

}
