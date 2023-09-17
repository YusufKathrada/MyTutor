import { Component, Input, EventEmitter, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-timeslots-popover-component',
  templateUrl: './timeslots-popover-component.component.html',
  styleUrls: ['./timeslots-popover-component.component.scss'],
})
export class TimeslotsPopoverComponentComponent {

  @Input() showCourseEvents: any = [];
  @Output() deleteTutorEvent = new EventEmitter<{ eventId: number, userId: string }>();

  deleteTutorFromEvent(eventId: number, userId: string) {
    this.deleteTutorEvent.emit({ eventId, userId });
  }


  constructor() { }

  ngOnInit() {}

}
