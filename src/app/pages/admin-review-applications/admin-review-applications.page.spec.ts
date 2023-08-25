import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminReviewApplicationsPage } from './admin-review-applications.page';

describe('AdminReviewApplicationsPage', () => {
  let component: AdminReviewApplicationsPage;
  let fixture: ComponentFixture<AdminReviewApplicationsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReviewApplicationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReviewApplicationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
