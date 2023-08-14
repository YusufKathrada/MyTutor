import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './user-data';


@Injectable({
  providedIn: 'root'
})
export class Admin extends UserData {


  constructor(
    public storage: Storage,
    public user: UserData
  ) {
    super(storage);
  }

  /*
  *  Functions for: Admin
  *  Phase 1: Log in / out (user inherit), Upload time slots
  *  Phase 2: Tutor Feedback, Accept / Reject tutor applications
  */


}
