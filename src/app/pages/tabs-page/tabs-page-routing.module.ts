import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';
import { SchedulePage } from '../schedule/schedule';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'schedule',
        children: [
          {
            path: '',
            component: SchedulePage,
          },
          {
            path: 'session/:sessionId',
            loadChildren: () => import('../session-detail/session-detail.module').then(m => m.SessionDetailModule)
          }
        ]
      },
      {
        path: 'speakers',
        children: [
          {
            path: '',
            loadChildren: () => import('../speaker-list/speaker-list.module').then(m => m.SpeakerListModule)
          },
          {
            path: 'session/:sessionId',
            loadChildren: () => import('../session-detail/session-detail.module').then(m => m.SessionDetailModule)
          },
          {
            path: 'speaker-details/:speakerId',
            loadChildren: () => import('../speaker-detail/speaker-detail.module').then(m => m.SpeakerDetailModule)
          }
        ]
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: () => import('../map/map.module').then(m => m.MapModule)
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
          }
        ]
      },
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

