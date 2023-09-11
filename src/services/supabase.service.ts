import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from '../environments/environment'
import { ToastController } from '@ionic/angular'


@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor(
    private toastController: ToastController,
  ) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  // ======================================== Error Handler ========================================

  async presentError() {
    const toast = await this.toastController.create({
      message: 'Something went wrong, please try again or contact support',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  // ======================================== Auth ========================================

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  // ======================================== Sign In ========================================

  async signInWithPassword(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password })
  }

  // ======================================== Sign Out ========================================

  signOut() {
    return this.supabase.auth.signOut()
  }


  // ======================================== Sign Up ========================================
  async signUp(user: any) {
    return await this.supabase.auth.signUp({
      email: user.username,
      password: user.password,
      options: {
        data: {
          userrole: user.role,
        }
      }
    });
  }

  // ======================================== User ========================================
  /**
   * API calls to interact with the user table. This contains general information about the user
   */

  async getAllUsers() {
    try {
      let { data: Users, error } = await this.supabase
        .from('Users')
        .select('*')

      if (error) throw error

      return Users

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }

  }

  async getUserById(id: string) {
    try {
      let { data: Users, error } = await this.supabase
        .from('Users')
        .select('*')
        .eq('id', id)

      if (error) throw error

      return Users

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getAllUsersByRole(role: string) {
    try {
      let { data: Users, error } = await this.supabase
        .from('Users')
        .select('*')
        .eq('role', role)

      if (error) throw error

      return Users

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }

  }

  /**
   *
   * @param user - User object to be inserted into the database
   * Needs attributes: name, surname, email, role, stuNum
   */

  async updateUser(user: User) {
    try {
      let { data: Users, error } = await this.supabase
        .from('Users')
        .update(user)
        .eq('id', user.id)

      if (error) throw error

      return Users


    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  // ======================================== Application ========================================
  /**
   * API calls to interact with the application table. This is application that student / ta submits
   */

  async getAllApplications() {
    try {
      let { data: Application, error } = await this.supabase
        .from('Application')
        .select('*')

      if (error) throw error

      return Application

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getApplicationById(id: string) {
    try {
      let { data: Application, error } = await this.supabase
        .from('Application')
        .select('*')
        .eq('id', id)

      if (error) throw error

      return Application

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  /**
   * @param application - Application object to be inserted into the database
   * Needs attributes: name, surname, stuNum, degree, yearOfStudy, average, preferredCourse, qualification
   * status entered as 'pending' by default
   */
  async postApplication(application: any) {
    try {
      let { status, error } = await this.supabase
        .from('Application')
        .insert(application)

      if (error) throw error

      return status

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async acceptApplication(id: any) {
    let status: any = await this.getStatusIdByDescription('Accepted')

    try {
      let { data: Application, error } = await this.supabase
        .from('Application')
        .update({ status: status[0].data.id })
        .eq('id', id)

      if (error) throw error

      return Application

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async rejectApplication(id: any) {
    let status: any = await this.getStatusIdByDescription('Rejected')

    try {
      let { data: Application, error } = await this.supabase
        .from('Application')
        .update({ status: status[0].data.id })
        .eq('id', id)

      if (error) throw error

      return Application

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async updateApplication(id: number, statusId: number) {
    try {
      let { status, error } = await this.supabase
        .from('Application')
        .update({ statusId: statusId })
        .eq('id', id)

      if (error) throw error

      return status

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getAllAcceptedTutors() {
    try {
      let { data: AcceptedTutors, error } = await this.supabase
        .from('Application')
        .select('*')
        .eq('statusId', 2)
        .is('qualification', null)

      if (error) throw error

      return AcceptedTutors

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getAllAcceptedTAs() {
    try {
      let { data: AcceptedTAs, error } = await this.supabase
        .from('Application')
        .select('*')
        .eq('statusId', 2)
        .is('stuNum', null)

      if (error) throw error

      return AcceptedTAs

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getApplicationByUserId(userId: string) {
    try {
      let { data: Application, error } = await this.supabase
        .from('Application')
        .select(`
          *,
          status:statusId (description)
        `)
        .eq('userId', userId);


      if (error) throw error

      return Application

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async updateApplicationResponse(userId: string, response: string){
    try {
      let { status, error } = await this.supabase
        .from('Application')
        .update({ response: response })
        .eq('userId', userId);

      if (error) throw error

      return status

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  // ======================================== Status ========================================
  /**
   * API calls to interact with the status table. This gives the status of the application
   */

  async getAllStatuses() {
    try {
      let { data: Statuses, error } = await this.supabase
        .from('Status')
        .select('*')

      if (error) throw error

      return Statuses

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getStatusIdByDescription(description: string) {
    try {
      let { data: Status, error } = await this.supabase
        .from('Status')
        .select('id')
        .eq('description', description)

      if (error) throw error

      return Status

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }


  // ======================================== Assigned Tutors and Assigned TAs ========================================
  /**
   * API calls to interact with the assigned tutors table. This is how tutors are liked to assigned sessions
   */

  async getAllAssignedTutors() {
    try {
      let { data: AssignedTutors, error } = await this.supabase
        .from('Assigned Tutors')
        .select('*')

      if (error) throw error

      return AssignedTutors

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getAllAssignedTAs() {
    try {
      let { data: AssignedTAs, error } = await this.supabase
        .from('Assigned TAs')
        .select('*')

      if (error) throw error

      return AssignedTAs

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getCourseIdForTutor(tutorId: string) {
    try {
      let { data: AssignedTutors, error } = await this.supabase
        .from('Assigned Tutors')
        .select('courseId')
        .eq('userId', tutorId)

      if (error) throw error

      return AssignedTutors

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async postAssignedTutors(tutorId: string, courseId: number, assignedStatus: boolean) {
    try {
      let { status, error } = await this.supabase
        .from('Assigned Tutors')
        .upsert(
          {
            userId: tutorId,
            courseId: courseId,
            assignedStatus: assignedStatus,
          },
          { onConflict: 'userId' })
        .select()

      if (error) throw error

      console.log('status', status)
      return status

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async postAssignedTAs(taId: string, courseId: number, assignedStatus: boolean) {
    try {
      let { status, error } = await this.supabase
        .from('Assigned TAs')
        .upsert(
          {
            userId: taId,
            courseId: courseId,
            assignedStatus: assignedStatus,
          },
          { onConflict: 'userId' })
        .select()

      if (error) throw error

      console.log('status', status)
      return status

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async updateCourseForTutor(tutorId: string, courseId: number) {
    try {
      let { data: AssignedTutors, error } = await this.supabase
        .from('Assigned Tutors')
        .update({ courseId: courseId })
        .eq('userId', tutorId)

      if (error) throw error

      return AssignedTutors

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }


  // ======================================== Courses ========================================
  /**
   * API calls to interact with the courses table.
   */

  async getAllCourses() {
    try {
      let { data: Courses, error } = await this.supabase
        .from('Courses')
        .select('*')

      if (error) throw error

      return Courses

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getCourseId(courseName: string) {
    try {
      let { data: Courses, error } = await this.supabase
        .from('Courses')
        .select('id')
        .eq('name', courseName)

      if (error) throw error;

      return Courses

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async insertCourse(course: any) {
    try {
      let { data: Courses, error } = await this.supabase
        .from('Courses')
        .insert(course)

      if (error) throw error

      return Courses

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }


  // ======================================== Events ========================================
  /**
   * API calls to interact with the events table. This stores all the information about the 'event' that is being scheduled
   * The event is denominated by the 'event type', which is tutorial, workshop, practical, etc
   * This will have dates and times for event sessions
   */

  async getAllEvents() {
    try {
      // Over here I have created a view on the database that combines the events table with the type of session and courses table to make access easy
      let { data: allEvents, error } = await this.supabase
        .from('allevents')
        .select('*')

      if (error) throw error

      return allEvents

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getEventById(id: string) {
    try {
      let { data: Events, error } = await this.supabase
        .from('Events')
        .select('*')
        .eq('id', id)

      if (error) throw error

      return Events

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getEventByCourseId(courseId: string) {
    try {
      let { data: Events, error } = await this.supabase
        .from('Events')
        .select(
          `
          *,
          typeOfSession:sessionId (description)
          `
        )
        .eq('courseId', courseId)

      if (error) throw error

      return Events

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async insertEvent(event: any) {
    try {
      let { status, error } = await this.supabase
        .from('Events')
        .insert(event)

      if (error) throw error

      return status

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async updateEventWithId(event: any, id: string) {
    try {
      let { data: Events, error } = await this.supabase
        .from('Events')
        .update(event)
        .eq('id', id)

      if (error) throw error

      return Events

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async updateEventTutorCount(eventId: string) {
    try {
      // Get the current number of tutors needed
      let { data: Events, error } = await this.supabase
        .from('Events')
        .select('tutorsNeeded')
        .eq('id', eventId);

      if (error || !Events || Events.length === 0) throw error || new Error("Event not found");

      const newTutorCount = Events[0].tutorsNeeded - 1;

      // Update value
      const { data: updatedEvents, error: updateError } = await this.supabase
        .from('Events')
        .update({ tutorsNeeded: newTutorCount })
        .eq('id', eventId)
        .select();

      if (updateError) throw updateError;

      return updatedEvents;

    } catch (error) {
      console.log('error', error);
      await this.presentError();
    }
  }

  // ======================================== Type of Session ========================================
  /**
   * API calls to interact with the event types table. Stores the type of event
   */

  async getAllSessionTypes() {
    try {
      let { data: SessionTypes, error } = await this.supabase
        .from('Type of Session')
        .select('*')

      if (error) throw error

      return SessionTypes

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getSessionId(sessionName: string) {
    try {
      let { data: SessionTypes, error } = await this.supabase
        .from('Type of Session')
        .select('id')
        .eq('description', sessionName)

      if (error) throw error;

      return SessionTypes

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async insertSessionType(sessionType: any) {
    try {
      let { data: SessionTypes, error } = await this.supabase
        .from('Type of Session')
        .insert(sessionType)

      if (error) throw error

      return SessionTypes

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  // ======================================== Tutors to Events ========================================
  /**
   * API calls to interact with the tutors to events types table. Stores which tutors are assigned to which events
   */

  async insertTutorForEvent(eventId: string, userId: string) {
    try {
      let { status, error } = await this.supabase
        .from('Tutors to Events')
        .upsert({ eventId: eventId, userId: userId })
        .select()

      if (error) throw error

      return status

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }
}
