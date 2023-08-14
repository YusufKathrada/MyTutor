import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './user-data';


@Injectable({
  providedIn: 'root'
})
export class Student extends UserData {


  constructor(
    public storage: Storage
  ) {
    super(storage);
  }

  /*
  *  Functions for: Admin
  *  Phase 1: Log in / out (user inherit), Apply for tutor role
  *  Phase 2: Rate tutors
  */
}
