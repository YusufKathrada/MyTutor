import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.page.html',
  styleUrls: ['./view-attendance.page.scss'],
})
export class ViewAttendancePage implements OnInit {

  screenWidth: number = this.platform.width();

  constructor(
    private platform: Platform
  ) {
    this.platform.resize.subscribe(() => {
      this.screenWidth = this.platform.width();
    });
   }

  ngOnInit() {
  }

}
