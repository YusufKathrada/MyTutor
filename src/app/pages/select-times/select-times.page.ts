import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-times',
  templateUrl: './select-times.page.html',
  styleUrls: ['./select-times.page.scss'],
})
export class SelectTimesPage implements OnInit {

  sessions: any = [{
      tutorialNumber: "Tutorial 1",
      day: "Mond",
      time: "08:00 - 10:00",
      availability: "3/4",
      action: "join",
      full: false 
    },
    {
      tutorialNumber: "Tutorial 2",
      day: "Tues",
      time: "09:00 - 11:00",
      availability: "5/5",
      action: "full",
      full: true
    }  
  ];

  constructor() { }

  ngOnInit() {
  }

}
