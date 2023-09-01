import { Component, OnInit } from '@angular/core';
import { Admin } from '../../providers/admin';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-admin-allocate-tutors',
  templateUrl: './admin-allocate-tutors.page.html',
  styleUrls: ['./admin-allocate-tutors.page.scss'],
})
export class AdminAllocateTutorsPage implements OnInit {

  acceptedTutors: any = [];
  courses: any = [];
  courseMap: any = [];

  //Basic courses added for now, proper list should be updated in future
  // Course: any = [
  // {
  //   courseName: "",
  //   courseCode: "Unassigned"
  // },
  // {
  //   courseName: "Intro to Computer Science",
  //   courseCode: "CSC1001F"
  // },
  // {
  // courseName: "Intro to Java",
  //   courseCode: "CSC1002S"
  // },
  // {
  //   courseName: "Data Structures and Algorithms",
  //     courseCode: "CSC2001F"
  // },
  // {
  //   courseName: "Parallel Computing",
  //     courseCode: "CSC2002S"
  // },
  // {
  //   courseName: "Networks and Operating Systems",
  //     courseCode: "CSC3001F"
  // },
  // {
  //   courseName: "Advanced Software Development",
  //     courseCode: "CSC3002S"
  // },
// ]

  constructor(
    public admin: Admin,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    await this.presentLoading();

    this.acceptedTutors = await this.admin.getAcceptedTutors();
    this.courses = await this.admin.getCourses();

    console.log('courses: ', this.courses);
    this.courseMap = this.courses.reduce((map, obj) => {
      map[obj.courseCode] = obj.id;
      return map;
    }, {});

    console.log('tutorAssignedCourse: ', this.acceptedTutors);
    await this.getAndFormatTutors();

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

  async getAndFormatTutors(){
    let tutors = await this.admin.getAcceptedTutors();

    this.acceptedTutors = tutors.map((tutor) => {
      return {
        id: tutor.id,
        tutorName: `${tutor.name} ${tutor.surname}`,
        tutorNum: tutor.stuNum,
        assignedCourse: tutor.courseCode
      }
    });
  }

  async updateTutorAllocations(){
    console.log("acceptedTutors: ", this.acceptedTutors);

    this.presentLoading();
    let success: boolean = true;
    for (const tutor of this.acceptedTutors){
       let res = await this.admin.updateTutorAllocations(tutor.id, this.courseMap[tutor.assignedCourse]);
       if (res !== 204) {
          success = false;
          break;
       }
    }
    this.loadingCtrl.dismiss();

    if (success) {
      this.presentToast("Tutor allocations updated successfully", "success");
    } else {
      this.presentToast("Error updating tutor allocations", "danger");
    }
  }

  test(){
    console.log("Tutors", this.acceptedTutors)
  }

}
