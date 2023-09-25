import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signup: any = {
    name: '',
    surname: '',
    email: '',
    nameId: '',
    password: '',
    role: ''
  };
  submitted = false;

  constructor(
    public router: Router,
    public userData: UserData,
    private supabase: SupabaseService,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
  ) {}

  // signup
  async onSignup(form: NgForm) {
    this.submitted = true;

    let role: string = 'pendingTa';

    const user: any = {
      name: form.value.name,
      surname: form.value.surname,
      email: form.value.email,
      nameId: form.value.nameId,
      password: form.value.password,
      role: role
    }

    try {

      // check if form is valid
      if (form.valid) {

        const loading = await this.loadingCtrl.create({
          message: 'Please wait...',
        });
        await loading.present();

        // sign up user with supabase
        const { data, error } = await this.supabase.signUp(
          {
            email: user.email,
            password: user.password,
            role: user.role,
          }
        );

        const userId = data.user.id;

        // update user with name, surname, nameId, email, role in the Users table
        await this.supabase.updateUser({
          id: userId,
          name: user.name,
          surname: user.surname,
          nameId: user.nameId,
          email: user.email,
          role: user.role,
        });


        if (error) throw error;

        // signup user locally
        this.userData.signup(user);

        await loading.dismiss();

        const toast = await this.toastCtrl.create({
          message: 'Signup successful',
          duration: 3000,
          position: 'bottom',
          color: 'success',
        });
        toast.present();
        this.router.navigateByUrl('/login');
      }
      else{
        const toast = await this.toastCtrl.create({
          message: 'Please fill in all fields',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
        });
        toast.present();
      }
    } catch (error) {
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

  backToLogin(){
    this.router.navigateByUrl('/login');
  }
}
