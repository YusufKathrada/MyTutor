import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Student } from '../../providers/student';
import { TA } from '../../providers/ta';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { SupabaseService } from '../../../services/supabase.service';
import { Storage } from '@ionic/storage-angular';

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
    transcript: null
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
    if(!form.valid) {
      this.presentToast('Please fill in all fields.', 'danger');
      return;
    }

    if (form.valid) {
      // const file = this.tutorApplication.transcript;
      if(!this.file) {
        this.presentToast('Please upload your transcript.', 'danger');
        return;
      }
      this.presentLoading();

      const userId = await this.storage.get('userId');
      const filePath = `${userId}/doc.pdf`;

      let res: any;
      if (this.segment === 'tutor') {

        if(!this.validateTutorApplication()) {
          this.presentToast('Please fill in all fields.', 'danger');
          return;
        }

        res = await this.student.applyForTutor(this.tutorApplication);
        await this.supabase.uploadFile(this.file, filePath);
      }
      else if (this.segment === 'TA') {

        if(!this.validateTAApplication()) {
          this.presentToast('Please fill in all fields.', 'danger');
          return;
        }

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

  onFileChangeTutor(event: any) {
    // const file = event.target.files[0];
    this.file = event.target.files[0];
    if (this.file) {
      this.tutorApplication.transcript = this.file;
    }
  }

  onFileChangeTA(event: any) {
    // const file = event.target.files[0];
    this.file = event.target.files[0];
    if (this.file) {
      this.taApplication.transcript = this.file;
    }
  }
}
