import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { Convenor } from '../../providers/convener';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.page.html',
  styleUrls: ['./view-attendance.page.scss'],
})
export class ViewAttendancePage implements OnInit {

  screenWidth: number = this.platform.width();

  convenerCourse: any;
  courseID: number;
  eventsForCourse: any;
  sessionTypes: any;
  formattedEventsForCourse: any;

  attendanceRecords: any;
  userAttendance: any;

  constructor(
    private convenor: Convenor,
    // public storage: Storage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform
  ) {
    this.platform.resize.subscribe(() => {
      this.screenWidth = this.platform.width();
    });
   }

  async ngOnInit() {

  }

  // refresh the page
  async ionViewWillEnter() {
    await this.presentLoading();
    await this.doRefresh();
    await this.dismissLoading();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingCtrl.dismiss();
  }


  async doRefresh() {
    await this.getConvenorCourse();

    // get the course ID
    this.courseID = await this.convenor.getCourseId();

    // get the session types
    this.sessionTypes = await this.convenor.getAllSessions();

    // get the events for the course
    this.eventsForCourse = await this.convenor.getEventsForCourse(this.courseID);
    const eventIds = this.eventsForCourse.map((event: any) => event.id);

    // format the events for the course
    this.attendanceRecords = await this.convenor.getAttendanceRecords(eventIds);

    // format the attendance records
    this.userAttendance = this.formatAttendanceRecords(this.attendanceRecords);
  }


  // get the course that the convener is assigned to
  async getConvenorCourse() {
    let res: any = await this.convenor.getCourse();
    this.convenerCourse = res[0].courses.name;
  }

  // Format attendance records for display so that it is per user
  formatAttendanceRecords(attendanceRecords: any) {
    let userAttendance: any = {};
    for (let record of attendanceRecords) {
      if (userAttendance[record.userId]) {
        userAttendance[record.userId].push(record);
      }
      else {
        userAttendance[record.userId] = [record];
      }
    }
    // Make it an array
    userAttendance = Object.keys(userAttendance).map((key) => userAttendance[key]);
    return userAttendance;
  }

  formatTime(time: string) {
    return time.slice(0, 5);
  }

  // get the progress of the user as a decimal
  getProgress(a: string, b: string){
    return (parseInt(a) / parseInt(b));
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }

}
