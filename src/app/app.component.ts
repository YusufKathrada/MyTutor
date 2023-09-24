import { Component, OnInit, ViewEncapsulation, Inject, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';

import { MenuController, Platform, ToastController, LoadingController } from '@ionic/angular';

import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

import { Storage } from '@ionic/storage-angular';

import { UserData } from './providers/user-data';
import { SupabaseService } from '../services/supabase.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  adminPages = [
    {
      title: 'Upload Time Slots',
      url: '/app/tabs/upload-times',
      icon: 'cloud-upload'
    },
    {
      title: 'Allocate Courses',
      url: '/app/tabs/admin-allocate-tutors',
      icon: 'book'
    },
    {
      title: 'Review Applications',
      url: '/app/tabs/admin-review-applications',
      icon: 'documents'
    },
    {
      title: 'Allocate Conveners',
      url: '/app/tabs/allocate-conveners',
      icon: 'people'
    }
  ];

  convenerPages = [
    {
      title: 'Upload Time Slots',
      url: '/app/tabs/upload-times',
      icon: 'cloud-upload'
    },
    {
      title: 'Update TA Privileges',
      url: '/app/tabs/convener-edit-ta',
      icon: 'documents'
    },
    {
      title: 'Attendance Codes',
      url: '/app/tabs/attendance-codes-generator',
      icon: 'qr-code'
    },
    {
      title: 'View Attendance',
      url: '/app/tabs/view-attendance',
      icon: 'checkbox'
    },
    {
      title: 'Announcements',
      url: '/app/tabs/announcements',
      icon: 'megaphone'
    }
  ];

  taPages = [
    {
      title: 'Upload Time Slots',
      url: '/app/tabs/upload-times',
      icon: 'cloud-upload'
    },
    {
      title: 'Allocate Courses',
      url: '/app/tabs/admin-allocate-tutors',
      icon: 'people'
    }
  ];

  tutorPages = [
    {
      title: 'Select timeslot',
      url: '/app/tabs/select-times',
      icon: 'calendar'
    },
    {
      title: 'View Selected times',
      url: '/app/tabs/tutor-events',
      icon: 'documents'
    },
    {
      title: 'Attendance',
      url: '/app/tabs/tutor-attendance',
      icon: 'checkbox'
    },
    {
      title: 'Announcements',
      url: '/app/tabs/tutor-announcements',
      icon: 'megaphone'
    },
  ];

  studentPages = [
    {
      title: 'Apply for a role',
      url: '/app/tabs/apply-for-tutor',
      icon: 'person-add'
    },
    {
      title: 'View application status',
      url: '/app/tabs/view-application-status',
      icon: 'documents'
    },
  ];

  appPages = [
    {
      title: 'Schedule',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    {
      title: 'Speakers',
      url: '/app/tabs/speakers',
      icon: 'people'
    },
    {
      title: 'Map',
      url: '/app/tabs/map',
      icon: 'map'
    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information-circle'
    },
    {
      title: 'Upload timeslots',
      url: '/app/tabs/upload-times',
      icon: 'cloud-upload'
    },
    {
      title: 'Select timeslot',
      url: '/app/tabs/select-times',
      icon: 'calendar'
    },
    {
      title: 'Apply for a role',
      url: '/app/tabs/apply-for-tutor',
      icon: 'person-add'
    },
  ];
  loggedIn = false;
  dark = false;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private supabase: SupabaseService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    await this.storage.create();
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });

    this.setMenu();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        StatusBar.hide();
        SplashScreen.hide();
      }
    });
  }

  async setMenu() {
    if (await this.userData.getRole() == "admin") {
      this.appPages = this.adminPages;
    }
    else if (await this.userData.getRole() == "courseConvener") {
      this.appPages = this.convenerPages;
    }
    else if (await this.userData.getRole() == "tutor") {
      this.appPages = this.tutorPages;
    }
    else if (await this.userData.getRole() == "student") {
      this.appPages = this.studentPages;
    }
    else if (await this.userData.getRole() == "ta") {
      this.appPages = this.taPages;
    }
  }

  checkLoginStatus() {
    console.log("loggedIn", this.loggedIn);

    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingCtrl.dismiss();
  }

  async logout() {
    this.presentLoading();

    // const url = 'http://localhost:3000/api/login?type=logout';
    let url = 'https://my-tutor-api.vercel.app/api/login?type=logout';
    const userId = await this.storage.get('userId');
    let res: any = await this.supabase.getSessionTokenAndNameId(userId);
    console.log('signout')

    // The user has logged in with UCT SAML and has a session with UCT
    if(res && res.length && res[0].session_index){
    // if(false){
      const body = {
        name_id: res[0].nameId,
        session_index: res[0].session_index,
      };

      try {
        // let response: any = await lastValueFrom(this.http.post(url, body));
        // const logoutUrl = response.logout_url;
        // console.log('logoutUrl', logoutUrl);

        await this.userData.logout().then(() => {
          // return this.router.navigateByUrl('/login');
          window.location.href = 'https://projsso1.cs.uct.ac.za/auth/realms/uct/protocol/openid-connect/logout'
        });

        this.dismissLoading();

        // window.location.href = logoutUrl;

      } catch (error) {
        console.log('app.component.ts error', error)
      }
    }
    // The user has logged in with Supabase login
    else{
      const { error } = await this.supabase.signOut();

      if (error) {
        console.log("error", error);
        const toast = await this.toastCtrl.create({
          message: error.message,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        return;
      }

      await this.userData.logout().then(async () => {
        await this.router.navigateByUrl('/login');
        return window.location.reload();
      });

      this.dismissLoading();
    }
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }
}
