import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-timeslots-popover-component',
  templateUrl: './timeslots-popover-component.component.html',
  styleUrls: ['./timeslots-popover-component.component.scss'],
})
export class TimeslotsPopoverComponentComponent {

  @Input() showCourseEvents: any = [];

  constructor() { }

  ngOnInit() {}

}
