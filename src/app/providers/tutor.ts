import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './user-data';


@Injectable({
  providedIn: 'root'
})
export class Tutor extends UserData {


  constructor(
    public storage: Storage
  ) {
    super(storage);
  }

  /*
  *  Functions for: Tutor
  *  Phase 1: Log in / out (user inherit), Select Tutor times
  *  Phase 2: Tick attendance
  */
}
