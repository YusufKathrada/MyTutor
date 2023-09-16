import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './user-data';
import { SupabaseService } from '../../services/supabase.service';


@Injectable({
  providedIn: 'root'
})
export class Student extends UserData {


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

  async applyForTutor(tutorApplication: any) {
    let status: any = await this.supabaseService.getStatusIdByDescription('Pending');
    const userId = await this.storage.get('userId');

    const tutorApplicationData: any = {
      statusId: status[0].id,
      name: tutorApplication.name,
      surname: tutorApplication.surname,
      email: null,
      stuNum: tutorApplication.studentNumber,
      degree: tutorApplication.degreeOfStudy,
      yearOfStudy: tutorApplication.yearOfStudy,
      average: tutorApplication.averageGrade,
      preferredCourse: null,
      qualification: null,
      userId: userId,
    }

    return await this.supabaseService.postApplication(tutorApplicationData);
  }

  async getTutorApplication() {
    const userId = await this.storage.get('userId');
    return await this.supabaseService.getApplicationByUserId(userId);
  }

  async getTutorCourseAssigned() {
    const userId = await this.storage.get('userId');
    return await this.supabaseService.getCourseAssignedByUserId(userId);
  }

  async updateApplicationResponse(response: any, applicationType: any) {
    const userId = await this.storage.get('userId');

    if(applicationType === 'Tutor' && response === 'accept'){
      await this.supabaseService.updateRole(userId, 'tutor');
    }
    else if(applicationType === 'TA' && response === 'accept'){
      await this.supabaseService.updateRole(userId, 'ta');
    }
    return await this.supabaseService.updateApplicationResponse(userId, response);
  }
}
