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
    await this.presentLoading();

    await this.getConvenorCourse();

    this.courseID = await this.convenor.getCourseId();
    console.log('courseID', this.courseID);

    this.sessionTypes = await this.convenor.getAllSessions();
    console.log('sessionTypes', this.sessionTypes);

    this.eventsForCourse = await this.convenor.getEventsForCourse(this.courseID);
    console.log('eventsForCourse', this.eventsForCourse);
    const eventIds = this.eventsForCourse.map((event: any) => event.id);
    console.log('eventIds', eventIds);

    this.attendanceRecords = await this.convenor.getAttendanceRecords(eventIds);
    console.log('attendanceRecords', this.attendanceRecords);

    this.userAttendance = this.formatAttendanceRecords(this.attendanceRecords);

    await this.dismissLoading();
  }

  async getConvenorCourse() {
    let res: any = await this.convenor.getCourse();
    this.convenerCourse = res[0].courses.name;
    console.log("ConvenerCourse", this.convenerCourse);
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
    console.log('userAttendance', userAttendance);
    return userAttendance;
  }

  formatTime(time: string) {
    return time.slice(0, 5);
  }

  getProgress(a: string, b: string){
    return (parseInt(a) / parseInt(b));
  }

  async presentLoading() {
    const loadingController = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    await loadingController.present();
  }

  async dismissLoading() {
    await this.loadingCtrl.dismiss();
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
