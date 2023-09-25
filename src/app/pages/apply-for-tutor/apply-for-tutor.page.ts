import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Student } from '../../providers/student';
import { TA } from '../../providers/ta';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { SupabaseService } from '../../../services/supabase.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-apply-for-tutor',
  templateUrl: './apply-for-tutor.page.html',
  styleUrls: ['./apply-for-tutor.page.scss'],
})
export class ApplyForTutorPage implements OnInit {

  role: string = '';
  courses: any = [];
  courseMap: any = [];

  tutorApplication = {
    name: '',
    surname: '',
    studentNumber: '',
    degreeOfStudy: '',
    yearOfStudy: '',
    averageGrade: '',
    transcript: null,
    highestCSCourse: null,
  };

  taApplication = {
    name: '',
    surname: '',
    email: '',
    degree_completed: '',
    desired_course: '',
    transcript: null
  };

  segment: string = '';
  file: any = null;

  constructor(
    public student: Student,
    public ta: TA,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private supabase: SupabaseService,
    private storage: Storage,
    private router: Router // Inject Router
  ) { }

  async ngOnInit() {
    console.log('ngOnInit');
    this.role = await this.storage.get('role');

  }

  ionViewDidEnter() {
    // This method is called when the page has fully entered (navigated back to)
    // You can trigger a refresh or reload here
    this.reloadPage();
  }

  async presentLoading() {
    await this.loadingController.create({
      message: 'Please wait...',
    }).then((res) => {
      res.present();
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 2000
    });
    toast.present();
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      this.presentToast('Please fill in all fields.', 'danger');
      return;
    }

    // Check if form is valid
    if (form.valid) {
      if (!this.file) {
        this.presentToast('Please upload your transcript.', 'danger');
        return;
      }
      this.presentLoading();

      // Get the user id from storage and set the filepath for db
      const userId = await this.storage.get('userId');
      const filePath = `${userId}/doc.pdf`;

      let res: any;
      // Submit the application
      if (this.segment === 'tutor') {
        if (!this.validateTutorApplication()) {
          this.presentToast('Please fill in all fields.', 'danger');
          return;
        }

        res = await this.student.applyForTutor(this.tutorApplication);
        await this.supabase.uploadFile(this.file, filePath);
      }
      else if (this.segment === 'TA') {
        if (!this.validateTAApplication()) {
          this.presentToast('Please fill in all fields.', 'danger');
          return;
        }

        // apply for ta
        res = await this.ta.applyForTA(this.taApplication);
        await this.supabase.uploadFile(this.file, filePath);
      }
      this.loadingController.dismiss();

      if (res == 201) {
        this.presentToast('Application submitted successfully.', 'success');
      }
      else {
        this.presentToast('Application failed.', 'danger');
      }
    }
  }

  validateTutorApplication() {
    for (const [key, value] of Object.entries(this.tutorApplication)) {
      if (!value) {
        return false;
      }
    }
    return true;
  }

  validateTAApplication() {
    for (const [key, value] of Object.entries(this.taApplication)) {
      if (!value) {
        return false;
      }
    }
    return true;
  }

  // get the file
  onFileChangeTutor(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.tutorApplication.transcript = this.file;
    }
  }

  // get the file
  onFileChangeTA(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.taApplication.transcript = this.file;
    }
  }

  async getAllCourses() {
    this.courses = await this.student.getCourses();

    // Removes 'UNASSIGNED' course from the list
    const unassignedCourse = 0;
    this.courses = this.courses.filter(course => course.id !== unassignedCourse);
   }
  // Function to simulate a page refresh
  async reloadPage() {
    // Function to simulate a page refresh
  // Clear the values in the tutorApplication and taApplication objects
      this.tutorApplication = {
      name: '',
      surname: '',
      studentNumber: '',
      degreeOfStudy: '',
      yearOfStudy: '',
      averageGrade: '',
      transcript: null,
      highestCSCourse: null,
    };

    this.taApplication = {
      name: '',
      surname: '',
      email: '',
      degree_completed: '',
      desired_course: '',
      transcript: null
    };

    this.getAllCourses();

    this.courseMap = this.courses.reduce((map, obj) => {
      map[obj.name] = obj.id;
      return map;
    }, {});

  }
}

