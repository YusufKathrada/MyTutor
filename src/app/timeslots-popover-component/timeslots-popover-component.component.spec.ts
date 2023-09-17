import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimeslotsPopoverComponentComponent } from './timeslots-popover-component.component';

describe('TimeslotsPopoverComponentComponent', () => {
  let component: TimeslotsPopoverComponentComponent;
  let fixture: ComponentFixture<TimeslotsPopoverComponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeslotsPopoverComponentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeslotsPopoverComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
