import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './user-data';
import { SupabaseService } from '../../services/supabase.service';


@Injectable({
  providedIn: 'root'
})
export class Tutor extends UserData {


  constructor(
    public storage: Storage,
    public supabase: SupabaseService
  ) {
    super(storage);
  }

  /*
  *  Functions for: Tutor
  *  Phase 1: Log in / out (user inherit), Select Tutor times
  *  Phase 2: Tick attendance
  */

  async getCourseIDForTutor(userId: string) {
    return await this.supabase.getCourseIdForTutor(userId);
  }

  async getTutorTimes(userId: string) {
    let res = await this.getCourseIDForTutor(userId);

    if(!res.length) throw new Error('No course found for tutor')

    let courseId = res[0].courseId;
    return await this.supabase.getEventByCourseId(courseId);
  }

  async getChosenEvents(userId: string) {
    return await this.supabase.getChosenEvents(userId);
  }

  async getChosenEventsDetails(userId: string) {
    return await this.supabase.getAllEventsDetails(userId);
  }

  async removeEvent(eventId: string, userId: string) {
    let status = await this.supabase.deleteTutorForEvent(eventId, userId);
    if (status == 204) {
      return await this.supabase.updateEventTutorCount(eventId, +1);
    }
    else {
      throw new Error('Error removing event');
    }
  }

  async joinEvent(eventId: string, userId: string) {
    let status = await this.updateTutorsToEvent(eventId, userId);
    if (status == 201) {
      return await this.supabase.updateEventTutorCount(eventId, -1);
    }
    else {
      throw new Error('Error joining event');
    }
  }

  async updateTutorsToEvent(eventId: string, userId: string) {
    return await this.supabase.insertTutorForEvent(eventId, userId);
  }

  async updateAttendance(eventId: string, userId: string) {
    return await this.supabase.updateAttendance(eventId, userId);
  }
}
