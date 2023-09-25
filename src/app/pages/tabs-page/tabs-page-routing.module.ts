import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';

// Configure routes for the app (for redirecting to the correct page)
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'upload-times',
        children: [
          {
            path: '',
            loadChildren: () => import('../upload-times/upload-times.module').then(m => m.UploadTimesPageModule)
          }
        ]
      },
      {
        path: 'select-times',
        children: [
          {
            path: '',
            loadChildren: () => import('../select-times/select-times.module').then(m => m.SelectTimesPageModule)
          }
        ]
      },
      {
        path: 'apply-for-tutor',
        children: [
          {
            path: '',
            loadChildren: () => import('../apply-for-tutor/apply-for-tutor.module').then(m => m.ApplyForTutorPageModule)
          }
        ]
      },
      {
        path: 'admin-allocate-tutors',
        children: [
          {
            path: '',
            loadChildren: () => import('../admin-allocate-tutors/admin-allocate-tutors.module').then(m => m.AdminAllocateTutorsPageModule)
          }
        ]
      },
      {
        path: 'admin-review-applications',
        children: [
          {
            path: '',
            loadChildren: () => import('../admin-review-applications/admin-review-applications.module').then(m => m.AdminReviewApplicationsPageModule)
          }
        ]
      },
      {
        path: 'view-application-status',
        children: [
          {
            path: '',
            loadChildren: () => import('../view-application-status/view-application-status.module').then(m => m.ViewApplicationStatusPageModule)
          }
        ]
      },
      {
        path: 'tutor-events',
        children: [
          {
            path: '',
            loadChildren: () => import('../tutor-events/tutor-events.module').then(m => m.TutorEventsPageModule)
          }
        ]
      },
      {
        path: 'allocate-conveners',
        children: [
          {
            path: '',
            loadChildren: () => import('../allocate-conveners/allocate-conveners.module').then(m => m.AllocateConvenersPageModule)
          }
        ]
      },
      {
        path: 'convener-edit-ta',
        children: [
          {
            path: '',
            loadChildren: () => import('../convener-edit-ta/convener-edit-ta.module').then(m => m.ConvenerEditTaPageModule)
          }
        ]
      },
      {
        path: 'attendance-codes-generator',
        children: [
          {
            path: '',
            loadChildren: () => import('../attendance-codes-generator/attendance-codes-generator.module').then(m => m.AttendanceCodesGeneratorPageModule)
          }
        ]
      },
      {
        path: 'tutor-attendance',
        children: [
          {
            path: '',
            loadChildren: () => import('../tutor-attendance/tutor-attendance.module').then(m => m.TutorAttendancePageModule)
          }
        ]
      },
      {
        path: 'announcements',
        children: [
          {
            path: '',
            loadChildren: () => import('../announcements/announcements.module').then(m => m.AnnouncementsPageModule)
          }
        ]
      },
      {
        path: 'tutor-announcements',
        children: [
          {
            path: '',
            loadChildren: () => import('../tutor-announcements/tutor-announcements.module').then(m => m.TutorAnnouncementsPageModule)
          }
        ]
      },
      {
        path: 'view-attendance',
        children: [
          {
            path: '',
            loadChildren: () => import('../view-attendance/view-attendance.module').then(m => m.ViewAttendancePageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/tabs/schedule',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

