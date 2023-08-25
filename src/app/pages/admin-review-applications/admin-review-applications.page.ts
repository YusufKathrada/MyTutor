import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-review-applications',
  templateUrl: './admin-review-applications.page.html',
  styleUrls: ['./admin-review-applications.page.scss'],
})
export class AdminReviewApplicationsPage implements OnInit {

  tutorApplications: any = [
    {
      studentName: "John Doe",
      degree: "BSc CS",
      yearOfStudy: "2",
      average: 76,
      desiredCourse: "CSC1001F",
      status: ""
    },
    {
      studentName: "Steven Adams",
      degree: "BBusSc CS",
      yearOfStudy: "3",
      average: 72,
      desiredCourse: "CSC2002S",
      status: ""
    },
    {
      studentName: "Mary Lamb",
      degree: "BSc CS",
      yearOfStudy: "3",
      average: 64,
      desiredCourse: "CSC2001F",
      status: ""
    }
  ]

  applicationStatus: any = [
    {
      status: "Accepted"
    },
    {
      status: "Pending"
    },
    {
      status: "Rejected"
    }
  ]

  constructor() { }

  ngOnInit() {
  }

  test(){
    console.log(this.tutorApplications)
  }

}
