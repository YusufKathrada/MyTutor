import { Component, OnInit } from '@angular/core';
import { Admin } from '../../providers/admin';
import { LoadingController, ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-admin-allocate-tutors',
  templateUrl: './admin-allocate-tutors.page.html',
  styleUrls: ['./admin-allocate-tutors.page.scss'],
})
export class AdminAllocateTutorsPage implements OnInit {

  screenWidth: number = this.platform.width();

  public segment: string = '';
  public filterOption: string = 'all';
  originalData: any;

  assignedTutors: any = [];
  unassignedTutors: any = [];
  assignedTAs: any = [];
  unassignedTAs: any = [];

  acceptedTutors: any = [];
  acceptedTAs: any = [];
  displayedTutors: any = [];
  displayedTAs: any = [];

  courses: any = [];
  courseMap: any = [];

  allocatedTutors: any = [];
  tutorsMap: any = [];
  allocatedTAs: any = [];
  tasMap: any = [];

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
    console.log('AdminAllocateTutorsPage.events.ngOnInit');
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


  async getAndFormatTutors() {
    this.displayedTutors = this.acceptedTutors.map((tutor) => {

      const assignedCourse = this.tutorsMap[tutor.userId];

      return {
        userId: tutor.userId,
        tutorName: `${tutor.name} ${tutor.surname}`,
        tutorNum: tutor.stuNum,
        assignedCourse: this.tutorsMap[tutor.userId] ? this.courses.find((course) => { return course.id === this.tutorsMap[tutor.userId] }).name : 'UNASSIGNED',
        assignedStatus: assignedCourse >=1 && assignedCourse <= 11,
        highestCSCourse: tutor.highestCSCourse,
      }
    });

    this.assignedTutors = this.displayedTutors.filter((tutor) => tutor.assignedStatus);
    this.unassignedTutors = this.displayedTutors.filter((tutor) => !tutor.assignedStatus);
  }


  async getAndFormatTAs() {
    this.displayedTAs = this.acceptedTAs.map((ta) => {

      const assignedCourse = this.tasMap[ta.userId];

      return {
        userId: ta.userId,
        taName: `${ta.name} ${ta.surname}`,
        assignedCourse: this.tasMap[ta.userId] ? this.courses.find((course) => { return course.id === this.tasMap[ta.userId] }).name : 'UNASSIGNED',
        assignedStatus: assignedCourse >=1 && assignedCourse <= 11,
        preferredCourse: ta.preferredCourse,
      }
    });

    this.assignedTAs = this.displayedTAs.filter((ta) => ta.assignedStatus);
    this.unassignedTAs = this.displayedTAs.filter((ta) => !ta.assignedStatus);
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

    this.ngOnInit();
  }


  async updateTAAllocations() {
    this.presentLoading();
    let success: boolean = true;
    const updatePromisesTaToCourse = [];
    const updatePromisesTaUser = [];

    for (const ta of this.displayedTAs) {
      if (!ta.assignedCourse || ta.assignedCourse === "UNASSIGNED") {
        ta.assignedStatus = false;
      } else {
        ta.assignedStatus = true;
      }

      // Add each update operation to an array of promises
      updatePromisesTaToCourse.push(
        this.admin.updateTAAllocations(
          ta.userId,
          this.courseMap[ta.assignedCourse],
          ta.assignedStatus
        )
      );

      updatePromisesTaUser.push(
        this.admin.updateCourseConvener(
          ta.userId,
          this.courseMap[ta.assignedCourse],
        )
      );
    }

    try {
      // Execute all update operations concurrently
      const resultsTaToCourse = await Promise.all(updatePromisesTaToCourse);
      const resultsTaUser = await Promise.all(updatePromisesTaUser);

      // Check if any operation returned a non-201 status
      if (resultsTaToCourse.some((res) => res !== 201)) {
        success = false;
      }

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

    this.ngOnInit();
  }


  async applyTutorFilter() {
    this.getAndFormatTutors();

    switch (this.filterOption) {
      case 'all':
        // Display all students
        this.getAndFormatTutors();
        break;
      case 'assigned':
        // Display only students with assigned courses
        this.displayedTutors = this.assignedTutors;
        break;
      case 'unassigned':
        // Display only unassigned students
        this.displayedTutors = this.unassignedTutors;
        break;
      default:
        break;
    }
  }


  async applyTAFilter() {
    this.getAndFormatTAs();

    switch (this.filterOption) {
      case 'all':
        // Display all students
        this.getAndFormatTAs();
        break;
      case 'assigned':
        // Display only students with assigned courses
        this.displayedTAs = this.assignedTAs;
        break;
      case 'unassigned':
        // Display only unassigned students
        this.displayedTAs = this.unassignedTAs;
        break;
      default:
        break;
    }
  }


  async doRefresh(event) {
    this.acceptedTutors = await this.admin.getAcceptedTutors();
    this.acceptedTAs = await this.admin.getAcceptedTAs();

    this.courses = await this.admin.getCourses();

    this.allocatedTutors = await this.admin.getTutorAllocations();
    this.allocatedTAs = await this.admin.getTAAllocations();

    this.courseMap = this.courses.reduce((map, obj) => {
      map[obj.name] = obj.id;
      return map;
    }, {});

    this.tutorsMap = this.allocatedTutors.reduce((map, obj) => {
      map[obj.userId] = obj.courseId;
      return map;
    }, {});

    this.tasMap = this.allocatedTAs.reduce((map, obj) => {
      map[obj.userId] = obj.courseId;
      return map;
    }, {});

    await this.getAndFormatTutors();
    await this.getAndFormatTAs();


  }

  filterPossibleCourses(courses: any, highestCSCourse) {
    const highestCSCourseId = this.courseMap[highestCSCourse];
    return courses.filter((course) => course.id <= highestCSCourseId);
  }


  getColorClass(courseName: string): string {
    return courseName === 'UNASSIGNED' ? 'red-background' : 'green-background';
  }

}

