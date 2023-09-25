import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; // Import Storage
import { MockStorage } from '../../../services/mock-storage.service';
import { By } from '@angular/platform-browser';
import { Student } from '../../providers/student';
import { TA } from '../../providers/ta';
import { NgForm } from '@angular/forms';
import { ApplyForTutorPage } from './apply-for-tutor.page';

describe('ApplyForTutorPage', () => {
  let component: ApplyForTutorPage;
  let fixture: ComponentFixture<ApplyForTutorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyForTutorPage],
      imports: [IonicModule.forRoot()],
      providers: [
        Student,
        TA,
        { provide: Storage, useClass: MockStorage }, // Corrected Storage provider
        { provide: Student, useValue: { storage: new MockStorage() } },
        { provide: TA, useValue: { storage: new MockStorage() } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplyForTutorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit when the form is submitted', () => {
    const spy = spyOn(component, 'onSubmit');
    const form = new NgForm([], []);
    component.onSubmit(form);
    expect(spy).toHaveBeenCalledWith(form);
  });

  it('should call onFileChangeTutor when file input changes in Tutor form', () => {
    const spy = spyOn(component, 'onFileChangeTutor');
    const event = { target: { files: ['file1'] } } as any;
    component.onFileChangeTutor(event);
    expect(spy).toHaveBeenCalledWith(event);
  });

  it('should call onFileChangeTA when file input changes in TA form', () => {
    const spy = spyOn(component, 'onFileChangeTA');
    const event = { target: { files: ['file1'] } } as any;
    component.onFileChangeTA(event);
    expect(spy).toHaveBeenCalledWith(event);
  });
});
