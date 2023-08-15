import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-upload-times',
  templateUrl: './upload-times.page.html',
  styleUrls: ['./upload-times.page.scss'],
})
export class UploadTimesPage implements OnInit {

  public eventForm: FormGroup;
  course: string = '';

  constructor(
    private fb: FormBuilder,
    private toastCtrl: ToastController
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('UploadTimesPage');
    this.addSession();
  }

  createForm() {
    this.eventForm = this.fb.group({
      sessions: this.fb.array([])
    });
  }

  get sessions(): FormArray {
    return this.eventForm.get('sessions') as FormArray;
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

  addSession() {
    const sessionGroup = this.fb.group({
      tutorialNumber: ['', Validators.required],
      day: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      tutorsNeeded: ['', Validators.required],
    });

    this.sessions.push(sessionGroup);
  }

  addItem() {
    const lastSession = this.sessions.at(this.sessions.length - 1);

    if (lastSession.valid) {
      this.addSession();
      console.log("added course", this.course);
      console.log("added slot", this.eventForm.value);
    } else {
      this.presentToast("Please fill all the fields in the current session before adding a new one.");
    }
  }

  removeLastSession(){
    if(this.sessions.length > 1){
      this.sessions.removeAt(this.sessions.length - 1);
    }
  }

  setCourse(ev: any) {
    this.course = ev.detail.value.toString().toUpperCase();
  }

  validate(){
    console.log("Validating form", this.eventForm.value);
    let sessions = this.eventForm.value.sessions as Array<any>;

    if(sessions.length && sessions[sessions.length - 1].tutorialNumber == "") {
      sessions.pop();
    }

    if(sessions.length == 0) {
      this.presentToast("Please add at least one session.");
      return;
    }

    let valid = true;
    let message = "";

    for(let i = 0; i < sessions.length; i++) {
      let session = sessions[i];
      if(session.tutorialNumber == "" || session.day == "" || session.startTime == "" || session.endTime == "" || session.tutorsNeeded == "") {
        valid = false;
        message = "Please fill all the fields.";
        break;
      }
    }

    if(valid) {
      this.submit(sessions);
    } else {
      this.presentToast(message);
    }
  }

  submit(form: any) {
    //remove the last session if it is empty
    if(form.length && form[form.length - 1].tutorialNumber == "") {
      form.pop();
    }

    console.log("Submitted form:", form);
  }
}

