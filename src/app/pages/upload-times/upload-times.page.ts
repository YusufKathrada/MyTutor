import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Admin } from '../../providers/admin';
import { LoadingController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { TimeslotsPopoverComponentComponent } from '../../timeslots-popover-component/timeslots-popover-component.component';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-upload-times',
  templateUrl: './upload-times.page.html',
  styleUrls: ['./upload-times.page.scss'],
})
export class UploadTimesPage implements OnInit {

  // @Input() deleteTutorEvent(eventId: number, userId: string) {
  //   this.deleteTutorFromEvent(eventId, userId);
  // }

  screenSize: any = this.platform.width();

  public eventForm: FormGroup;
  course: string = '';

  allEventsWithIDs: any = [];
  allTutorsToEvents: any = [];

  tutorsToEventsMap: any = [];

  allEvents: any = [];
  showCourseEvents: any = [];
  courses: any = [];
  selectedGender: string = 'all';

  allCourses: any = [];
  sessionTypes: any = [];
  days: any = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private admin: Admin,
    public popoverController: PopoverController,
    public platform: Platform
  ) {
    this.createForm();
    this.platform.resize.subscribe(() => {
      this.screenSize = this.platform.width();
    });
  }

  async ngOnInit() {
    this.addSession();
    await this.refreshEvents();

    await this.getAllCourses();

    this.sessionTypes = await this.admin.getAllSessions();

    this.allEventsWithIDs = await this.admin.getAllEventsFromEventsTable();
    console.log("allEventsWithID: ", this.allEventsWithIDs);

    this.allTutorsToEvents = await this.admin.getAllTutorsToEvents();
    console.log("allTutorsToEvents: ", this.allTutorsToEvents);

    await this.formatTutorsToEvents();
  }

  createForm() {
    this.eventForm = this.fb.group({
      sessions: this.fb.array([])
    });
  }

  async getAllCourses() {
    this.allCourses = await this.admin.getCourses();

    // Removes 'UNASSIGNED' course from the list
    const unassignedCourse = 0;
    this.allCourses = this.allCourses.filter(course => course.id !== unassignedCourse);

    console.log("allCourses: ", this.allCourses);
  }

  get sessions(): FormArray {
    return this.eventForm.get('sessions') as FormArray;
  }

  async refreshEvents() {
    let load = await this.loadingCtrl.create({
      message: 'Loading events...',
    });
    load.present();

    [this.allEvents, this.courses] = await this.admin.getAllEvents();
    console.log("allEvents: ", this.allEvents)
    console.log("courses: ", this.courses)

    load.dismiss();
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      color: color,
      duration: 2000
    });
    toast.present();
  }

  addSession() {
    const sessionGroup = this.fb.group({
      eventType: ['', Validators.required],
      day: ['', Validators.required],
      startTime: [new Date().toTimeString().slice(0, 5), Validators.required],
      endTime: [new Date().toTimeString().slice(0, 5), Validators.required],
      tutorsNeeded: ['', Validators.required],
      venue: ['', Validators.required],
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

  selectCourse(ev: any) {
    // this.showCourseEvents = this.allEvents.filter((event) => { return event.name == ev.detail.value });
    // console.log("showCourseEvents: ", this.showCourseEvents);

    this.showCourseEvents = this.tutorsToEventsMap.filter((event) => { return event.course == ev.detail.value });
    console.log("showCourseEvents: ", this.showCourseEvents);
  }

  removeLastSession() {
    if (this.sessions.length > 1) {
      this.sessions.removeAt(this.sessions.length - 1);
    }
  }

  setCourse(ev: any) {
    this.course = ev.detail.value.toString().toUpperCase();
  }


  validate() {
    console.log("Validating form", this.eventForm.value);
    let sessions = this.eventForm.value.sessions as Array<any>;

    if (sessions.length && sessions[sessions.length - 1].tutorialNumber == "") {
      sessions.pop();
    }

    if (sessions.length == 0) {
      this.presentToast("Please add at least one session.");
      return;
    }

    let valid = true;
    let message = "";

    for (let i = 0; i < sessions.length; i++) {
      let session = sessions[i];
      if (session.tutorialNumber == "" || session.day == "" || session.startTime == "" || session.endTime == "" || session.tutorsNeeded == "" || session.venue == "") {
        valid = false;
        message = "Please fill all the fields.";
        break;
      }
    }

    if (valid) {
      this.submit(sessions);
    } else {
      this.presentToast(message);
    }
  }

  async submit(form: any) {
    const load = await this.loadingCtrl.create({
      message: 'Uploading time slots...',
    })
    load.present();

    //remove the last session if it is empty
    if (form.length && form[form.length - 1].tutorialNumber == "") {
      form.pop();
    }

    let res: any = await this.admin.uploadTimes(this.course, form);
    load.dismiss();

    if (res === 201) {
      this.presentToast("Time slots uploaded successfully!", "success");
    }
    else {
      this.presentToast("Error uploading time slots. Please try again.");
    }
    this.refreshEvents();
  }

  formatTime(time: string) {
    return time.slice(0, 5);
  }

  async formatTutorsToEvents() {

    this.tutorsToEventsMap = this.allEventsWithIDs.map((event) => {
      return {
        id: event.id,
        course: this.allCourses.find((course) => course.id === event.courseId).name,
        description: this.sessionTypes.find((session) => session.id === event.sessionId).description,
        day: event.day,
        startTime: event.startTime,
        endTime: event.endTime,
        venue: event.venue,
        tutorsNeeded: event.tutorsNeeded,
        //Below, currently returns UserIDs, should change to tutor names in future
        tutors: this.allTutorsToEvents.filter((tutor) => tutor.eventId === event.id).map((tutor) => tutor.userId)
      }
    });

    console.log("tutorsToEventsMap: ", this.tutorsToEventsMap);
  }

  async presentPopover(e: any) {
    let res = await this.admin.getTutorsFromEventId(e.id);

    if (res.length === 0) {
      res = [{
        name: "none",
        surname: "none",
        stuNum: "none",
        userId: "none"
      }]
    }

    const popover = await this.popoverController.create({
      component: TimeslotsPopoverComponentComponent,
      cssClass: 'popover-width-large',
      componentProps: {
        showCourseEvents: res,
      }
    });

    await popover.present();

  }

  async deleteEvent(eventId: number) {
    let load = await this.loadingCtrl.create({
      message: 'Removing event...',
    });
    load.present();

    let res = await this.admin.deleteEvent(eventId);

    load.dismiss();

    if (res === 204) {
      this.presentToast("Event removed successfully!", "success");
    }
    else {
      this.presentToast("Error removing event. Please try again.");
    }
    this.refreshEvents();
    //this.selectCourse({ detail: { value: this.course } });
  }

  async deleteTutorFromEvent(eventId: number, userId: string) {
    let load = await this.loadingCtrl.create({
      message: 'Removing tutor from event...',
    });
    load.present();

    console.log("eventId: ", eventId);
    console.log("tutorId: ", userId);
    let res = await this.admin.deleteTutorFromEvent(eventId, userId);

    load.dismiss();

    if (res === 204) {
      this.presentToast("Tutor removed from event successfully!", "success");
    }
    else {
      this.presentToast("Error removing tutor from event. Please try again.");
    }
    this.refreshEvents();
    //this.selectCourse({ detail: { value: this.course } });
  }

}

