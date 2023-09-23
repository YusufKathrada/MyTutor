import { Component, OnInit } from '@angular/core';
import { Convenor } from '../../providers/convener';
import { Storage } from '@ionic/storage-angular';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
})
export class AnnouncementsPage implements OnInit {

  announcementHeading: string = "";
  announcementBody: string = "";
  prevAnnouncements: any = [];
  formattedAnnouncements: any = [];

  convenerCourse: any;
  courseID: number;


  constructor(
    private storage: Storage,
    private convenor: Convenor,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    this.setConvener();

    this.courseID = await this.convenor.getCourseId();
    console.log('courseID', this.courseID);

    await this.getAnnouncements();

    await this.formatAnnouncements();
    console.log("formattedAnnouncements: ", this.formattedAnnouncements);
  }

  async setConvener(){
    try {
        let res: any = await this.convenor.getCourse();
        this.convenerCourse = res[0].courses.name;
        console.log("res: ", this.convenerCourse);
      } catch (error) {
        console.log('upload-times.page.ts ngOnInit() error: ', error);
      }
  }

  async validateAnnouncement(){
    if(this.announcementHeading == ""){
      this.presentToast("Please enter a heading for the announcement", "danger");
      return false;
    }
    if(this.announcementBody == ""){
      this.presentToast("Please enter a body for the announcement", "danger");
      return false;
    }
    return true;
  }

  async postAnnouncement(){
    const loading = await this.loadingCtrl.create({
      message: 'Posting Announcement...',
    });
    await loading.present();

    if(!await this.validateAnnouncement()){
      loading.dismiss();
      return;
    }

    try {
      let res: any = await this.convenor.postAnnouncement(this.courseID, this.announcementHeading, this.announcementBody);
      console.log("res: ", res);
      loading.dismiss();
      if(res == 201){
        this.presentToast("Announcement Posted Successfully!", "success");
      }
      else {
        this.presentToast("Error Posting Announcement", "danger");
      }
    } catch (error) {
      console.log('upload-times.page.ts ngOnInit() error: ', error);
    }

    this.refreshAnnouncements();
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      color: color,
      duration: 2000
    });
    toast.present();
  }

  async getAnnouncements(){ 
    //sort the announcements by date
    this.prevAnnouncements = await this.convenor.getAnnouncements(this.courseID);

    this.prevAnnouncements.sort((a: any, b: any) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    console.log("prevAnnouncements inside function: ", this.prevAnnouncements);
  }

  async formatAnnouncements(){
    
    this.formattedAnnouncements = this.prevAnnouncements.map((announcement: any) => {
      return {
        heading: announcement.announcementHeading,
        body: announcement.announcementBody,
        date: announcement.created_at.substring(0, 10),
        time: announcement.created_at.substring(11, 16)
      }
    });

  }

  async refreshAnnouncements(){
    this.announcementHeading = "";
    this.announcementBody = "";

    await this.getAnnouncements();
    await this.formatAnnouncements();
}
  
}
