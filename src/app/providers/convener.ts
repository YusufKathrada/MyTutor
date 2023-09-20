import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './user-data';
import { SupabaseService } from '../../services/supabase.service';


@Injectable({
  providedIn: 'root'
})
export class Convenor extends UserData {


  constructor(
    public storage: Storage,
    public supabaseService: SupabaseService
  ) {
    super(storage);
  }

  async getCourse(){
    const userId = await this.storage.get('userId');
    return await this.supabaseService.getConvenerCourse(userId);
  }

  async getTAForCourse(){
    const userId = await this.storage.get('userId');

    // Get the course id for the convener
    let res: any = await this.supabaseService.getConvenerCourseId(userId);
    let courseId = res[0].courseId;

    // Get the list of TAs for the course
    return await this.supabaseService.getTAsForCourse(courseId);
  }

  async updateTAs(TAs: any){
    for(let ta of TAs){
      if(ta.convenerPrivileges){
        await this.supabaseService.updateRole(ta.id, 'courseConvener');
        let res: any = await this.supabaseService.getCourseId(ta.course);
        let courseId = res[0].id;
        await this.supabaseService.updateCourseConvenerCourse(ta.id, courseId);
      }
      else{
        await this.supabaseService.updateRole(ta.id, 'ta');
        await this.supabaseService.updateCourseConvenerCourse(ta.id, 0);
      }
    }
  }

}
