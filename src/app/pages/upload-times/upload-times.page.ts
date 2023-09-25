import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Admin } from '../../providers/admin';
import { Convenor } from '../../providers/convener';
import { LoadingController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { TimeslotsPopoverComponentComponent } from '../../timeslots-popover-component/timeslots-popover-component.component';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-upload-times',
  templateUrl: './upload-times.page.html',
  styleUrls: ['./upload-times.page.scss'],
})
export class UploadTimesPage implements OnInit {

  screenSize: any = this.platform.width();

  isConvenor: boolean = false;
  convenerCourse: any;

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
    private convenor: Convenor,
    public popoverController: PopoverController,
    private router: Router,
    public platform: Platform,
    public alertController: AlertController,
    public storage: Storage,
  ) {
    this.createForm();
    this.platform.resize.subscribe(() => {
      this.screenSize = this.platform.width();
    });
  }

  // initialising the page and data (one time gets)
  async ngOnInit() {
    await this.getAllCourses();

    this.sessionTypes = await this.admin.getAllSessions();
    this.allEventsWithIDs = await this.admin.getAllEventsFromEventsTable();
    this.allTutorsToEvents = await this.admin.getAllTutorsToEvents();
    await this.formatTutorsToEvents();

    await this.refreshEvents();


  }

  // refresh the page
  async refreshEvents() {
    let load = await this.loadingCtrl.create({
      message: 'Loading events...',
    });
    load.present();

    // get all events and courses
    [this.allEvents, this.courses] = await this.admin.getAllEvents();

    // check if user is a course convenor
    this.isConvenor = (await this.storage.get('role') === 'courseConvener' || await this.storage.get('role') === 'taAdmin');
    if(this.isConvenor){
      await this.setConvener();
    }

    load.dismiss();
  }

  // refresh the page
  async ionViewWillEnter() {
    await this.reloadPage();
  }

  async setConvener(){
    try {
      // get the course name for the course convenor
        let res: any = await this.convenor.getCourse();
        this.convenerCourse = res[0].courses.name;
        this.course = this.convenerCourse;
        // format the course name to be displayed when calling selectCourse()
        let tempCourse = {
          detail: { value: this.convenerCourse }
        }
        // call selectCourse() to display the events for the course convenor
        this.selectCourse(tempCourse);
      } catch (error) {
        console.log('upload-times.page.ts ngOnInit() error: ', error);
      }
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

  }

  // get the sessions from the form
  get sessions(): FormArray {
    return this.eventForm.get('sessions') as FormArray;
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

  // add a session to the form
  addItem() {
    const lastSession = this.sessions.at(this.sessions.length - 1);

    if (lastSession.valid) {
      this.addSession();
    } else {
      this.presentToast("Please fill all the fields in the current session before adding a new one.");
    }
  }

  selectCourse(ev: any) {
    this.showCourseEvents = this.tutorsToEventsMap.filter((event) => { return event.course == ev.detail.value });
  }

  removeLastSession() {
    if (this.sessions.length > 1) {
      this.sessions.removeAt(this.sessions.length - 1);
    }
  }

  setCourse(ev: any) {
    this.course = ev.detail.value.toString().toUpperCase();
  }


  // validate the form and submit the data
  validate() {
    console.log("Validating form", this.eventForm.value);
    let sessions = this.eventForm.value.sessions as Array<any>;

    // remove the last session if it is empty
    if (sessions.length && sessions[sessions.length - 1].tutorialNumber == "") {
      sessions.pop();
    }

    if (sessions.length == 0) {
      this.presentToast("Please add at least one session.");
      return;
    }

    let valid = true;
    let message = "";

    // check if all fields are filled
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

    // upload the time slots
    let res: any = await this.admin.uploadTimes(this.course, form);
    load.dismiss();

    if (res === 201) {
      this.presentToast("Time slots uploaded successfully!", "success");
    }
    else {
      this.presentToast("Error uploading time slots. Please try again.");
    }
    await this.reloadPage();
    this.ngOnInit();
  }

  formatTime(time: string) {
    return time.slice(0, 5);
  }

  // Format the events to display in the table
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

  }

  // popover to display tutors allocated to event
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

    // create popover
    const popover = await this.popoverController.create({
      component: TimeslotsPopoverComponentComponent,
      cssClass: 'popover-width-large',
      componentProps: {
        showCourseEvents: res,
        eventId: e.id,
      }
    });

    await popover.present();

  }

  // delete event
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
    location.reload();

  }


  async presentAlert(eventId: number) {
    const alert = await this.alertController.create({
      subHeader: 'Are you sure you want to delete this event?',
      buttons: [
        {
          text: 'OK',
          role: 'ok'},
        {
          text: 'Cancel',
          role: 'cancel'}
        ],

    });

    //If selected 'OK' button then delete event by calling deleteEvent() function
    alert.onDidDismiss().then((data) => {
      if (data.role === 'ok') {
        this.deleteEvent(eventId);
      }
    });

    await alert.present();
  }


  reloadPage() {
    this.eventForm.reset(); // Reset the form
    this.sessions.clear(); // Clear form array
    this.addSession(); // Add an initial session
    this.course = ''; // Clear the course selection
    this.showCourseEvents = []; // Clear the displayed course events
    this.refreshEvents(); // Refresh events data
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}

