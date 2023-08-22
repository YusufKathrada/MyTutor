import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-allocate-tutors',
  templateUrl: './admin-allocate-tutors.page.html',
  styleUrls: ['./admin-allocate-tutors.page.scss'],
})
export class AdminAllocateTutorsPage implements OnInit {

  assignedTutors: any = [{
    studentName: "John Doe",
    studentNumber: "DOEJHN001",
    assignedCourse: "",
  },
  {
    studentName: "Mary Adams",
    studentNumber: "MRYADM001",
    assignedCourse: "",
  }  
];

  //Basic courses added for now, proper list should be updated in future
  Course: any = [
  {
    courseName: "",
    courseCode: "Unassigned"
  },
  {
    courseName: "Intro to Computer Science",
    courseCode: "CSC1001F"
  },
  {
  courseName: "Intro to Java",
    courseCode: "CSC1002S"
  },
  {
    courseName: "Data Structures and Algorithms",
      courseCode: "CSC2001F"
  },
  {
    courseName: "Parallel Computing",
      courseCode: "CSC2002S"
  },
  {
    courseName: "Networks and Operating Systems",
      courseCode: "CSC3001F"
  },
  {
    courseName: "Advanced Software Development",
      courseCode: "CSC3002S"
  },
]

  constructor() { }

  ngOnInit() {
  }

  test(){
    console.log("Tutors", this.assignedTutors)
  }

}
