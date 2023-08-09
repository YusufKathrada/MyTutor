import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import { LoadingController, ToastController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';



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
    public router: Router,
    public toastCtrl: ToastController,
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

        const role = data.user.user_metadata.userrole;
        this.userData.setRole(role);

        this.userData.login(this.login.username);
        this.router.navigateByUrl('/app/tabs/schedule');
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
