import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { checkTutorialGuard } from './providers/check-tutorial.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./pages/schedule/schedule.module').then(m => m.ScheduleModule)
  },
  {
    path: 'upload-times',
    loadChildren: () => import('./pages/upload-times/upload-times.module').then(m => m.UploadTimesPageModule)
  },
  {
    path: 'select-times',
    loadChildren: () => import('./pages/select-times/select-times.module').then(m => m.SelectTimesPageModule)
  },
  {
    path: 'apply-for-tutor',
    loadChildren: () => import('./pages/apply-for-tutor/apply-for-tutor.module').then(m => m.ApplyForTutorPageModule)
  },
  {
    path: 'admin-allocate-tutors',
    loadChildren: () => import('./pages/admin-allocate-tutors/admin-allocate-tutors.module').then(m => m.AdminAllocateTutorsPageModule)
  },
  {
    path: 'admin-review-applications',
    loadChildren: () => import('./pages/admin-review-applications/admin-review-applications.module').then(m => m.AdminReviewApplicationsPageModule)
  },
  {
    path: 'view-application-status',
    loadChildren: () => import('./pages/view-application-status/view-application-status.module').then(m => m.ViewApplicationStatusPageModule)
  },
  {
    path: 'tutor-events',
    loadChildren: () => import('./pages/tutor-events/tutor-events.module').then(m => m.TutorEventsPageModule)
  },  {
    path: 'allocate-conveners',
    loadChildren: () => import('./pages/allocate-conveners/allocate-conveners.module').then( m => m.AllocateConvenersPageModule)
  },
  {
    path: 'convener-edit-ta',
    loadChildren: () => import('./pages/convener-edit-ta/convener-edit-ta.module').then( m => m.ConvenerEditTaPageModule)
  },
  {
    path: 'attendance-codes-generator',
    loadChildren: () => import('./pages/attendance-codes-generator/attendance-codes-generator.module').then( m => m.AttendanceCodesGeneratorPageModule)
  },
  {
    path: 'tutor-attendance',
    loadChildren: () => import('./pages/tutor-attendance/tutor-attendance.module').then( m => m.TutorAttendancePageModule)
  },
  {
    path: 'view-attendance',
    loadChildren: () => import('./pages/view-attendance/view-attendance.module').then( m => m.ViewAttendancePageModule)
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
