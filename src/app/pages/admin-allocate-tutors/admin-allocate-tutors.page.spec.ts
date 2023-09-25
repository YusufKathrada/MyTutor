import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AdminAllocateTutorsPage } from './admin-allocate-tutors.page';
import { MockStorage } from '../../../services/mock-storage.service';
import { Admin } from '../../providers/admin';

TestBed.configureTestingModule({
  declarations: [
    AdminAllocateTutorsPage,
  ],
  schemas: [NO_ERRORS_SCHEMA]
}).compileComponents();

describe('AdminAllocateTutorsPage', () => {
  let component: AdminAllocateTutorsPage;
  let fixture: ComponentFixture<AdminAllocateTutorsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAllocateTutorsPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        Admin,
        { provide: Storage, useClass: MockStorage },
        { provide: Admin, useValue: { storage: new MockStorage() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAllocateTutorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change segment value', () => {
    component.segment = 'tutor';
    fixture.detectChanges();
    expect(component.segment).toEqual('tutor');
  });

  it('should call applyTutorFilter when the segment is tutor and filter is changed', () => {
    spyOn(component, 'applyTutorFilter');
    component.segment = 'tutor';
    component.filterOption = 'assigned';
    component.applyTutorFilter(); // Call this method manually as it’s normally called by (ionChange) event.
    expect(component.applyTutorFilter).toHaveBeenCalled();
  });

  it('should call applyTAFilter when the segment is TA and filter is changed', () => {
    spyOn(component, 'applyTAFilter');
    component.segment = 'TA';
    component.filterOption = 'assigned';
    component.applyTAFilter(); // Call this method manually as it’s normally called by (ionChange) event.
    expect(component.applyTAFilter).toHaveBeenCalled();
  });

  it('should call updateTutorAllocations method when the update button is clicked for tutor segment', () => {
    spyOn(component, 'updateTutorAllocations');
    component.updateTutorAllocations(); // Call this method manually as it’s normally called by (click) event.
    expect(component.updateTutorAllocations).toHaveBeenCalled();
  });

  it('should call updateTAAllocations method when the update button is clicked for TA segment', () => {
    spyOn(component, 'updateTAAllocations');
    component.updateTAAllocations(); // Call this method manually as it’s normally called by (click) event.
    expect(component.updateTAAllocations).toHaveBeenCalled();
  });
});
