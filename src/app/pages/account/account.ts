import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { UserData } from '../../providers/user-data';
import { CookieService } from 'ngx-cookie-service';
import { Storage } from '@ionic/storage-angular';
import { AppComponent } from '../../app.component';
import { SupabaseService } from '../../../services/supabase.service';
import { Admin } from '../../providers/admin';
import { Tutor } from '../../providers/tutor';
import { Student } from '../../providers/student';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements AfterViewInit {
  username: string;

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public userData: UserData,
    private cookieService: CookieService,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public appComponent: AppComponent,
    private supabase: SupabaseService,
    public admin: Admin,
    public tutor: Tutor,
    public student: Student,
    public toastCtrl: ToastController,
  ) { }

  ngAfterViewInit() {
    this.getUsername();
  }

  async ionViewWillEnter() {
    const userId = await this.storage.get('userId');
    if(!userId) {
      await this.initializeApp();
    }
  }

  async initializeApp() {
    const token = this.cookieService.getAll();

    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loading.present();

    try {
      const res = await this.supabase.getUserBySession(token.token);
      let user = res[0];

      if(!user) {
        await this.toastCtrl.create({
          message: 'User data not found in SAML assertion',
          duration: 2000,
          position: 'top',
        }).then(toast => toast.present());
        return;
      }

      await this.storage.set('userId', user.id);

      const role = user.role;
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
        default:
          break;
      };

      this.userData.login(user.nameId);
      await this.appComponent.setMenu();

    } catch (error) {
      console.error("Error getting user by session: ", error);
    }

    await loading.dismiss();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  async changeUsername() {
    const alert = await this.alertCtrl.create({
      header: 'Change Username',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            this.userData.setUsername(data.username);
            this.getUsername();
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'username',
          value: this.username,
          placeholder: 'username'
        }
      ]
    });
    await alert.present();
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  logout() {
    this.userData.logout();
    this.router.navigateByUrl('/login');
  }

  support() {
    this.router.navigateByUrl('/support');
  }
}
