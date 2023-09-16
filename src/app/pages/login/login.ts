import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import { LoadingController, ToastController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';
import { Admin } from '../../providers/admin';
import { Tutor } from '../../providers/tutor';
import { Student } from '../../providers/student';

import { UserOptions } from '../../interfaces/user-options';
import { AppComponent } from '../../app.component';
import { Storage } from '@ionic/storage-angular';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(
    private supabase: SupabaseService,
    private loadingCtrl: LoadingController,
    public userData: UserData,
    public admin: Admin,
    public tutor: Tutor,
    public student: Student,
    public router: Router,
    public toastCtrl: ToastController,
    public appComponent: AppComponent,
    public storage: Storage,
  ) { }

  async onLogin(form: NgForm) {
    try {
      this.submitted = true;

      if (form.valid) {

        const loading = await this.loadingCtrl.create({
          message: 'Please wait...',
        });
        await loading.present();

        const email = form.value.username;
        const password = form.value.password;

        const { data, error } = await this.supabase.signInWithPassword(email, password,);
        console.log("data", data);
        console.log("error", error);

        if (error) throw error;

        await this.storage.set('userId', data.user.id);

        const role = data.user.user_metadata.userrole;

        switch (role) {
          case 'admin':
            await this.admin.setRole('admin');
            break;
          case 'tutor':
            await this.tutor.setRole('tutor');
            break;
          case 'student':
            await this.student.setRole('student');
            break;
          case 'ta':
            await this.student.setRole('ta');
            break;
          default:
            break;
        };

        this.userData.login(this.login.username);
        await this.appComponent.setMenu();
        this.router.navigateByUrl('/account');
        await loading.dismiss();
      }
    }
    catch (error) {
      console.log("error", error);

      const toast = await this.toastCtrl.create({
        message: error.message,
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();

      await this.loadingCtrl.dismiss();
    }
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
