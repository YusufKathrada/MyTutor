import { Component, OnInit } from '@angular/core';
import { Admin } from '../../providers/admin';
import { LoadingController, ToastController } from '@ionic/angular';
import { assign } from 'cypress/types/lodash';

@Component({
  selector: 'app-admin-allocate-tutors',
  templateUrl: './admin-allocate-tutors.page.html',
  styleUrls: ['./admin-allocate-tutors.page.scss'],
})
export class AdminAllocateTutorsPage implements OnInit {

  public segment: string = '';

  acceptedTutors: any = [];
  acceptedTAs: any = [];
  displayedTutors: any = [];
  displayedTAs: any = [];
  courses: any = [];
  courseMap: any = [];

  constructor(
    public admin: Admin,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    await this.presentLoading();

    this.segment = 'tutor';


    
    this.acceptedTutors = await this.admin.getAcceptedTutors();
    this.acceptedTAs = await this.admin.getAcceptedTAs();
    console.log('acceptedTAs: ', this.acceptedTAs);
    this.courses = await this.admin.getCourses();

    // console.log('courses: ', this.courses);
    this.courseMap = this.courses.reduce((map, obj) => {
      map[obj.name] = obj.id;
      return map;
    }, {});
    // console.log('courseMap: ', this.courseMap);

    // console.log('acceptedTutors: ', this.acceptedTutors);
    await this.getAndFormatTutors();
    await this.getAndFormatTAs();

    console.log('dispalyedTAs', this.displayedTAs);

    // console.log('acceptedTutors: ', this.acceptedTutors);
    // console.log('displayedTutors: ', this.displayedTutors);

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

  async getAndFormatTutors() {

    this.displayedTutors = this.acceptedTutors.map((tutor) => {
      return {
        userId: tutor.userId,
        tutorName: `${tutor.name} ${tutor.surname}`,
        tutorNum: tutor.stuNum,
        assignedCourse: 'UNASSIGNED',
      }
    });
  }

  async getAndFormatTAs() {
    this.displayedTAs = this.acceptedTAs.map((ta) => {
      return {
        userId: ta.userId,
        taName: `${ta.name} ${ta.surname}`,
        assignedCourse: 'UNASSIGNED',
      }
    });
  }


  async updateTutorAllocations() {
    this.presentLoading();
    let success: boolean = true;
    const updatePromises = [];

    for (const tutor of this.displayedTutors) {
      if (!tutor.assignedCourse || tutor.assignedCourse === "UNASSIGNED") {
        tutor.assignedStatus = false;
      } else {
        tutor.assignedStatus = true;
      }

      // Add each update operation to an array of promises
      updatePromises.push(
        this.admin.updateTutorAllocations(
          tutor.userId,
          this.courseMap[tutor.assignedCourse],
          tutor.assignedStatus
        )
      );
    }

    try {
      // Execute all update operations concurrently
      const results = await Promise.all(updatePromises);

      // Check if any operation returned a non-201 status
      if (results.some((res) => res !== 201)) {
        success = false;
      }

      console.log('results', results);
    } catch (error) {
      // Handle any errors that might occur during the bulk update
      success = false;
    }

    this.loadingCtrl.dismiss();

    if (success) {
      this.presentToast("Tutor allocations updated successfully", "success");
    } else {
      this.presentToast("Error updating tutor allocations", "danger");
    }
  }

  async updateTAAllocations() {
    this.presentLoading();
    let success: boolean = true;
    const updatePromises = [];

    for (const ta of this.displayedTAs) {
      if (!ta.assignedCourse || ta.assignedCourse === "UNASSIGNED") {
        ta.assignedStatus = false;
      } else {
        ta.assignedStatus = true;
      }

      // Add each update operation to an array of promises
      updatePromises.push(
        this.admin.updateTAAllocations(
          ta.userId,
          this.courseMap[ta.assignedCourse],
          ta.assignedStatus
        )
      );
    }

    try {
      // Execute all update operations concurrently
      const results = await Promise.all(updatePromises);

      // Check if any operation returned a non-201 status
      if (results.some((res) => res !== 201)) {
        success = false;
      }

      console.log('results', results);
    } catch (error) {
      // Handle any errors that might occur during the bulk update
      success = false;
    }

    this.loadingCtrl.dismiss();

    if (success) {
      this.presentToast("TA allocations updated successfully", "success");
    } else {
      this.presentToast("Error updating TA allocations", "danger");
    }
  }


  // test(){
  //   console.log("Tutors", this.acceptedTutors)
  // }

}
