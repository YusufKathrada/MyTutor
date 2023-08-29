import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './user-data';
import { SupabaseService } from '../../services/supabase.service';


@Injectable({
  providedIn: 'root'
})
export class Admin extends UserData {


  constructor(
    public storage: Storage,
    public user: UserData,
    private supabase: SupabaseService
  ) {
    super(storage);
  }

  /*
  *  Functions for: Admin
  *  Phase 1: Log in / out (user inherit), Upload time slots
  *  Phase 2: Tutor Feedback, Accept / Reject tutor applications
  */

  async uploadTimes(course: string, eventInfo: any){
    let events = [];

    for(const event of eventInfo){
      const courseId = await this.supabase.getCourseId(course);
      const sessionId = await this.supabase.getSessionId(event.eventType)

      let eventObj = {
        courseId: courseId[0].id,
        sessionId: sessionId[0].id,
        day: event.day,
        startTime: this.formatTime(event.startTime) ,
        endTime: this.formatTime(event.endTime),
        venue: event.venue,
        tutorsNeeded: +event.tutorsNeeded,
      };

      events.push(eventObj);
    }

    console.log("events: ", events);
    return await this.supabase.insertEvent(events);
  }

  formatTime(time: string): string {
    // Your time string
    const timeString = time;

    // Convert time string to JavaScript Date object
    const timeObject = new Date();
    const [hours, minutes] = timeString.split(":").map(Number);
    timeObject.setHours(hours, minutes, 0, 0);

    // Format time for database
    const hh = timeObject.getHours().toString().padStart(2, '0');
    const mm = timeObject.getMinutes().toString().padStart(2, '0');
    const ss = timeObject.getSeconds().toString().padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
  }

  async getAllEvents(){
    let allEvents = await this.supabase.getAllEvents();

    let courses = allEvents.map((event) => { return event.name });
    courses = courses.filter((course, index) => { return courses.indexOf(course) === index });

    return [allEvents, courses];
  }


}
