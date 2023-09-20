import { Component, OnInit } from '@angular/core';
import { Admin } from '../../providers/admin';
import { LoadingController, ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-allocate-conveners',
  templateUrl: './allocate-conveners.page.html',
  styleUrls: ['./allocate-conveners.page.scss'],
})
export class AllocateConvenersPage implements OnInit {
  screenWidth: number = this.platform.width();

  public filterOption: string = 'all';

  public courses: any = [];
  courseMap: any = [];
  revCourseMap: any = [];
  public allConveners: any = [];
  public assignedConveners: any = [];
  public unassignedConveners: any = [];
  public displayedCCs: any = [];

  constructor(
    public admin: Admin,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform
  ) {
    this.platform.resize.subscribe(() => {
      this.screenWidth = this.platform.width();
    });
   }

  async ngOnInit() {
    console.log('AllocateConvenersPage.events.ngOnInit');
    this.courses = await this.admin.getCourses();

    this.courseMap = this.courses.reduce((map, obj) => {
      map[obj.name] = obj.id;
      return map;
    }, {});

    this.revCourseMap = this.courses.reduce((map, obj) => {
      map[obj.id] = obj.name;
      return map;
    }, {});
  }

  async ionViewWillEnter() {
    await this.presentLoading();
    await this.doRefresh(null);
    await this.dismissLoading();
  }

  async doRefresh(event) {
    try {
      let res = await this.admin.getAllCourseConveners()
      this.allConveners = res;
      this.assignedConveners = this.allConveners.filter(convener => convener.courseId !== 0);
      this.unassignedConveners = this.allConveners.filter(convener => convener.courseId === 0);
      this.displayedCCs = this.formatCCs(this.allConveners);
    } catch (error) {
      console.log('AllocateConvenersPage.events.doRefresh: ' + error);
    }

    if (event) {
      event.target.complete();
    }
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

  formatCCs(conveners){
    let formattedCCs = [];
    for(let convener of conveners){
      let formattedCC = {
        id: convener.id,
        name: `${convener.name} ${convener.surname}`,
        email: convener.email,
        course: this.revCourseMap[convener.courseId],
      }
      formattedCCs.push(formattedCC);
    }
    return formattedCCs;
  }

  async updateConveners() {
    await this.presentLoading();

    for(const convener of this.displayedCCs){
      try {
        await this.admin.updateCourseConvener(convener.id, this.courseMap[convener.course]);
        this.presentToast('Conveners updated', 'success');
      } catch (error) {
        console.log('AllocateConvenersPage.events.updateConveners: ' + error);
        this.presentToast('Error updating conveners', 'danger');
      }
    }

    await this.doRefresh(null);
    await this.dismissLoading();
  }

  applyFilter() {
    if (this.filterOption === 'all') {
      this.displayedCCs = this.formatCCs(this.allConveners);
    } else if (this.filterOption === 'assigned') {
      this.displayedCCs = this.formatCCs(this.assignedConveners);
    } else if (this.filterOption === 'unassigned') {
      this.displayedCCs = this.formatCCs(this.unassignedConveners);
    }
  }

  getColorClass(courseName: string): string {
    return courseName === 'UNASSIGNED' ? 'red-background' : 'green-background';
  }

}
