import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Student } from '../../providers/student';
import { TA } from '../../providers/ta';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-apply-for-tutor',
  templateUrl: './apply-for-tutor.page.html',
  styleUrls: ['./apply-for-tutor.page.scss'],
})
export class ApplyForTutorPage implements OnInit {

  tutorApplication = {
    name: '',
    surname: '',
    studentNumber: '',
    degreeOfStudy: '',
    yearOfStudy: '',
    averageGrade: '',
    // transcript: null
  };

  taApplication ={
    name: '',
    surname: '',
    email: '',
    degree_completed: '',
    desired_course: ''
  };

  segment: string = '';

  constructor(
    public student: Student,
    public ta: TA,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    console.log('ngOnInit')
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
    if (form.valid) {
      this.presentLoading();
      let res: any;
      if (this.segment === 'tutor') {
        // this.tutorApplication = form.value;
        res = await this.student.applyForTutor(this.tutorApplication);
      }
      else if (this.segment === 'TA') {
        // this.taApplication = form.value;
        res = await this.ta.applyForTA(this.taApplication);
      }
      this.loadingController.dismiss();

      if(res == 201){
        this.presentToast('Application submitted successfully.', 'success');
      }
      else{
        this.presentToast('Application failed.', 'danger');
      }
    }
  }

  // TODO
  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.tutorApplication.transcript = file;
  //   }
  // }
}
