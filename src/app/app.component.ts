import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { MenuController, Platform, ToastController } from '@ionic/angular';

import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

import { Storage } from '@ionic/storage-angular';

import { UserData } from './providers/user-data';
import { SupabaseService } from '../services/supabase.service';

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
      title: 'View selected times',
      url: '/app/tabs/tutor-events',
      icon: 'documents'
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
    private supabase: SupabaseService
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

  async logout() {
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

    this.userData.logout().then(() => {
      return this.router.navigateByUrl('/login');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }
}
