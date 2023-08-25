import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminAllocateTutorsPage } from './admin-allocate-tutors.page';

describe('AdminAllocateTutorsPage', () => {
  let component: AdminAllocateTutorsPage;
  let fixture: ComponentFixture<AdminAllocateTutorsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAllocateTutorsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAllocateTutorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
