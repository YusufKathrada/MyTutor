import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { MockStorage } from "../../../services/mock-storage.service";
import { Admin } from "../../providers/admin";
import { By } from "@angular/platform-browser";

import { AdminReviewApplicationsPage } from "./admin-review-applications.page";

TestBed.configureTestingModule({
  declarations: [AdminReviewApplicationsPage],
  schemas: [NO_ERRORS_SCHEMA],
}).compileComponents();

describe("AdminReviewApplicationsPage", () => {
  let component: AdminReviewApplicationsPage;
  let fixture: ComponentFixture<AdminReviewApplicationsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminReviewApplicationsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        Admin,
        { provide: Storage, useClass: MockStorage },
        { provide: Admin, useValue: { storage: new MockStorage() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReviewApplicationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with the correct segment", () => {
    expect(component.segment).toBe("tutor");
  });

  it("should apply tutor filter when filter option is changed", () => {
    spyOn(component, "applyTutorFilter");
    component.filterOption = "accepted";
    component.applyTutorFilter();
    expect(component.applyTutorFilter).toHaveBeenCalled();
  });

  it("should filter mark when minimumMark is changed", () => {
    spyOn(component, "filterMark");
    component.minimumMark = 50;
    component.filterMark();
    expect(component.filterMark).toHaveBeenCalled();
  });

  it("should call viewTranscript with the correct userId when clicked", () => {
    spyOn(component, "viewTranscript");
    const userId = "sampleUserId"; // Replace with an actual user ID from your component
    component.viewTranscript(userId);
    expect(component.viewTranscript).toHaveBeenCalledWith(userId);
  });

  it("should call updateTutors when clicked", () => {
    spyOn(component, "updateTutors");
    component.updateTutors();
    expect(component.updateTutors).toHaveBeenCalled();
  });

  it("should call updateTAs when clicked", () => {
    spyOn(component, "updateTAs");
    component.updateTAs();
    expect(component.updateTAs).toHaveBeenCalled();
  });

  it("should call applyTAFilter when filterOption is changed", () => {
    spyOn(component, "applyTAFilter");
    component.filterOption = "pending";
    component.applyTAFilter();
    expect(component.applyTAFilter).toHaveBeenCalled();
  });
});
