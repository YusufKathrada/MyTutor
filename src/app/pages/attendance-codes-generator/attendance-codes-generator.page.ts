import { Component, OnInit } from '@angular/core';
import { Convenor } from '../../providers/convener';
import { Storage } from '@ionic/storage-angular';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-attendance-codes-generator',
  templateUrl: './attendance-codes-generator.page.html',
  styleUrls: ['./attendance-codes-generator.page.scss'],
})
export class AttendanceCodesGeneratorPage implements OnInit {

  screenWidth: number = this.platform.width();


  convenerCourse: any;
  courseID: number;
  eventsForCourse: any;
  sessionTypes: any;
  formattedEventsForCourse: any;


  constructor(
    private convenor: Convenor,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
  ) {
    this.platform.resize.subscribe(() => {
      this.screenWidth = this.platform.width();
    });
  }

  async ngOnInit() {
    const load = await this.loadingCtrl.create({
      message: 'Loading...',
    })
    load.present();

    await this.getConvenorCourse();

    this.courseID = await this.convenor.getCourseId();
    console.log('courseID', this.courseID);

    this.sessionTypes = await this.convenor.getAllSessions();

    this.eventsForCourse = await this.convenor.getEventsForCourse(this.courseID);
    console.log('eventsForCourse', this.eventsForCourse);

    await this.formatEventsForCourse();
    console.log('formattedEventsForCourse', this.formattedEventsForCourse);

    load.dismiss();
  }

  async getConvenorCourse() {
    let res: any = await this.convenor.getCourse();
    this.convenerCourse = res[0].courses.name;
    console.log("ConvenerCourse", this.convenerCourse);
  }

  async formatEventsForCourse() {

    this.formattedEventsForCourse = this.eventsForCourse.map((event) => {
      return {
        id: event.id,
        description: this.sessionTypes.find((session) => session.id === event.sessionId).description,
        day: event.day,
        startTime: event.startTime,
        endTime: event.endTime,
        venue: event.venue,
        attendanceCode: event.attendancecode,
        createCode: false
      }
    });
  }

  formatTime(time: string) {
    return time.slice(0, 5);
  }

  //function that when i click a button it generates a random 6 character string code for each event
  //and then displays it in the attendance code column
  randomCodeGenerator() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  generateCodes() {
    this.formattedEventsForCourse.forEach((event) => {
      if(event.createCode)
        event.attendanceCode = this.randomCodeGenerator();
      else
        event.attendanceCode = null;
    });

    console.log('Generated attendance codes:', this.formattedEventsForCourse);
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      color: color,
      duration: 2000
    });
    toast.present();
  }

  async updateCodes() {
    const load = await this.loadingCtrl.create({
      message: 'Updating Attendance Codes...',
    })
    load.present();
    try {
      let eventsToUpdate = this.formattedEventsForCourse.map((event) => {
        return {
          id: event.id,
          attendancecode: event.attendanceCode
        }
      });

      let res: any = await this.convenor.updateEvents(eventsToUpdate);
      console.log('res', res);
      load.dismiss();

      this.presentToast("Attendance Codes Updated Successfully!", "success");

    } catch (error) {
      this.presentToast("Error updating Attendance Codes. Please try again.");
      console.error('Error updating attendance codes:', error);
    }
  }

}
