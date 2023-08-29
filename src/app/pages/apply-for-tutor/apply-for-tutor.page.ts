import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-apply-for-tutor',
  templateUrl: './apply-for-tutor.page.html',
  styleUrls: ['./apply-for-tutor.page.scss'],
})
export class ApplyForTutorPage implements OnInit {
  
  tutor = {
    name: '',
    surname: '',
    studentNumber: '',
    degreeOfStudy: '',
    yearOfStudy: '',
    desiredCourse: '',
    previousMark: '',
    transcript: null
  };

  ta ={
    name: '',
    surname: '',
    email: '',
    degree_completed: '',
    desired_course: ''
  };


  isTutor: boolean = false; // Initialized as false, will become true when Tutor is selected
  isTA: boolean = false; // Initialized as false, will become true when TA is selected

  constructor() { }

  ngOnInit() {
  }

  // Handle checkbox changes to ensure only one of them is true at a time
  onRoleChange(role: string) {
    if (role === 'Tutor') {
      this.isTutor = !this.isTutor;
      this.isTA = false;
    } else if (role === 'TA') {
      this.isTA = !this.isTA;
      this.isTutor = false;
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.isTutor) {
        this.tutor = form.value;
        console.log('Tutor info:', this.tutor);
      } else if (this.isTA) {
        this.ta = form.value;
        console.log('TA info:', this.ta);
      }
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.tutor.transcript = file;
    }
  }
}



 

