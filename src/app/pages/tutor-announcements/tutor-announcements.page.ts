import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Tutor } from '../../providers/tutor';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tutor-announcements',
  templateUrl: './tutor-announcements.page.html',
  styleUrls: ['./tutor-announcements.page.scss'],
})
export class TutorAnnouncementsPage implements OnInit {

  userId: string;
  courseId: number;
  courseName: string;

  prevAnnouncements: any = [];
  formattedAnnouncements: any = [];

  constructor(
    private storage: Storage,
    private tutor: Tutor,
    public loadingCtrl: LoadingController,
  ) { }

  async ngOnInit() {
    await this.setTutuor();
    console.log("courseId: ", this.courseId);
    console.log("courseName: ", this.courseName);
    await this.getAnnouncements();
    await this.formatAnnouncements();
  }

  async ionViewWillEnter() {
    await this.presentLoading();
    await this.refreshAnnouncements();
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

  async setTutuor() {
    this.userId = await this.storage.get('userId');

    let res = await this.tutor.getCourseIDForTutor(this.userId);
    this.courseId = res[0].courseId;

    let courseRes = await this.tutor.getAllCourses();
    this.courseName = courseRes.filter((course: any) => {
      return course.id == this.courseId;
    }
    )[0].name;
  }

  async getAnnouncements(){ 
    //sort the announcements by date
    this.prevAnnouncements = await this.tutor.getAnnouncements(this.courseId);

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
        time: announcement.created_at.substring(11, 16),
        isImportant: announcement.important,
        color: announcement.important ? 'danger' : 'light'
      }
    });

  }

  async refreshAnnouncements(){
    await this.getAnnouncements();
    await this.formatAnnouncements();
}
}
