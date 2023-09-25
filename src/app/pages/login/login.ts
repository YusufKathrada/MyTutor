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

import { HttpClient, HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';



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


    private http: HttpClient,
  ) { }

  // refresh page
  async ionViewWillEnter() {
    if(await this.userData.isLoggedIn()) {
      this.router.navigateByUrl('/account');
    }
  }
  // login and go to account page
  async onLogin(form: NgForm) {
    try {
      this.submitted = true;

      // if form is valid
      if (form.valid) {

        const loading = await this.loadingCtrl.create({
          message: 'Please wait...',
        });
        await loading.present();

        const email = form.value.username;
        const password = form.value.password;

        // sign in with email and password on supabase
        const { data, error } = await this.supabase.signInWithPassword(email, password,);

        if (error) throw error;

        await this.storage.set('userId', data.user.id);

        const role = data.user.user_metadata.userrole;

        // set role
        switch (role) {
          case 'admin':
            await this.admin.setRole('admin');
            break;
          case 'courseConvener':
            await this.admin.setRole('courseConvener');
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
          case 'pendingTa':
            await this.student.setRole('pendingTa');
            break;
          case 'taAdmin':
            await this.student.setRole('taAdmin');
            break;
          default:
            break;
        };

        // set user data and menu
        this.userData.login(this.login.username);
        await this.appComponent.setMenu();
        // navigate to account page
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

  // login with UCT credentials
  async uctLogin() {
    const loading = await this.loadingCtrl.create({
          message: 'Please wait...',
        });
    await loading.present();
    // Make a GET request to the Vercel serverless function
    let url = 'https://my-tutor-api.vercel.app/api/login';
    let res: any = await lastValueFrom(this.http.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    }));

    // Redirect to UCT login page
    const redirectUrl = res.login_url;
    window.location.href = redirectUrl;
    await loading.dismiss();
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
