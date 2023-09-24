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

  async onSignup(form: NgForm) {
    this.submitted = true;

    let role: string = 'pendingTa';

    // if(form.value.role === 'admin' || form.value.role === 'lecturer'){
    //   role = 'admin'
    // }
    // else if(form.value.role === 'ta'){
    //   role = 'pendingTa'
    // }
    // else{
    //   role = form.value.role;
    // }

    const user: any = {
      name: form.value.name,
      surname: form.value.surname,
      email: form.value.email,
      nameId: form.value.nameId,
      password: form.value.password,
      role: role
    }

    console.log("user", user);
    try {
      if (form.valid) {

        const loading = await this.loadingCtrl.create({
          message: 'Please wait...',
        });
        await loading.present();

        const { data, error } = await this.supabase.signUp(
          {
            email: user.email,
            password: user.password,
            role: user.role,
          }
        );

        const userId = data.user.id;

        await this.supabase.updateUser({
          id: userId,
          name: user.name,
          surname: user.surname,
          nameId: user.nameId,
          email: user.email,
          role: user.role,
        });

        console.log("data", data);
        console.log("error", error);

        if (error) throw error;

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
