import { Component, OnInit } from '@angular/core';
import { Convenor } from '../../providers/convener';
import { Storage } from '@ionic/storage-angular';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import html2canvas from 'html2canvas';

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
  }

  // load data on page enter
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

  // refresh page
  async doRefresh() {
    await this.getConvenorCourse();

    this.courseID = await this.convenor.getCourseId();

    this.sessionTypes = await this.convenor.getAllSessions();

    this.eventsForCourse = await this.convenor.getEventsForCourse(this.courseID);

    await this.formatEventsForCourse();

  }

  async getConvenorCourse() {
    let res: any = await this.convenor.getCourse();
    this.convenerCourse = res[0].courses.name;
  }

  // format events for course
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

  // function that generates codes for all events
  generateCodes() {
    this.formattedEventsForCourse.forEach((event) => {
      if(event.createCode)
        event.attendanceCode = this.randomCodeGenerator();
      else
        event.attendanceCode = null;
    });

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

      // update attendance codes
      let res: any = await this.convenor.updateEvents(eventsToUpdate);
      load.dismiss();

      this.presentToast("Attendance Codes Updated Successfully!", "success");

    } catch (error) {
      this.presentToast("Error updating Attendance Codes. Please try again.");
      console.error('Error updating attendance codes:', error);
    }
  }

  // function that generates a pdf of the attendance codes
  async generatePdf(type: string){
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    })
    loading.present();

    let element: HTMLElement;
    if(type === 'desktop'){
      element = document.getElementById('makepdfDesktop');
      html2canvas(element).then((canvas) => {
        // Define the crop dimensions
        const cropX = 0;
        const cropY = 0;
        const cropWidth = canvas.width - (5 * (96 / 2.54)); // Reducing 5cm from the canvas's right side
        const cropHeight = canvas.height;

        // Create a new canvas element
        const newCanvas = document.createElement('canvas');
        newCanvas.width = cropWidth;
        newCanvas.height = cropHeight;

        // Get the context of the new canvas
        const ctx = newCanvas.getContext('2d');

        // Draw the original canvas onto the new canvas
        ctx.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        // Get the image data as a base64-encoded string
        const imageData = newCanvas.toDataURL("image/png");

        // Create an anchor element and trigger a download action
        const link = document.createElement("a");
        link.setAttribute("download", "codes.png");
        link.setAttribute("href", imageData);
        link.click();

        loading.dismiss();
      });
    }
    else{
      element = document.getElementById('makepdfMobile');
      html2canvas(element).then((canvas) => {
        // Get the image data as a base64-encoded string
        const imageData = canvas.toDataURL("image/png");

        // Create an anchor element and trigger a download action
        const link = document.createElement("a");
        link.setAttribute("download", "codes.png");
        link.setAttribute("href", imageData);
        link.click();

        loading.dismiss();
      });
    }
    loading.dismiss();
  }
}
