import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './user-data';
import { SupabaseService } from '../../services/supabase.service';


@Injectable({
  providedIn: 'root'
})
export class TA extends UserData {


  constructor(
    public storage: Storage,
    public supabaseService: SupabaseService
  ) {
    super(storage);
  }

  /*
  *  Functions for: Student
  *  Phase 1: Log in / out (user inherit)
  *  Phase 2: Apply for tutor role
  */

  async applyForTA(taApplication: any) {
    let status: any = await this.supabaseService.getStatusIdByDescription('Pending');

    const tutorApplicationData: any = {
      statusId: status[0].id,
      name: taApplication.name,
      surname: taApplication.surname,
      email: taApplication.email,
      stuNum: null,
      degree: null,
      yearOfStudy: null,
      average: null,
      preferredCourse: taApplication.desired_course,
      qualification: taApplication.degree_completed,
    }

    return await this.supabaseService.postApplication(tutorApplicationData);
  }

  async getTAApplication() {
    const userId = await this.storage.get('userId');
    return await this.supabaseService.getApplicationByUserId(userId);
  }

  async updateApplicationResponse(response: any) {
    const userId = await this.storage.get('userId');
    return await this.supabaseService.updateApplicationResponse(userId, response);
  }
}
