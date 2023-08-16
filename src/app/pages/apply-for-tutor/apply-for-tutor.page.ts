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

  constructor() { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Tutor info:', this.tutor);
      // Send the form data to your server or handle it as needed
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.tutor.transcript = file;
    }
  }
}

