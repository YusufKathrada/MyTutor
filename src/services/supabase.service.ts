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

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  // ======================================== Error Handler ========================================

  async presentError() {
    // alert('Something went wrong, please try again or contact support')
    let toastController = new ToastController();
    const toast = await toastController.create({
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
      email: user.email,
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

  async updateRole(userId: string, role: string) {
    try {
      let { data: Users, error } = await this.supabase
        .from('Users')
        .update({ role: role })
        .eq('id', userId)
        .select()


      if (error) throw error

      return Users

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getUserBySession(session_index){
    try {
      let { data: Users, error } = await this.supabase
        .from('Users')
        .select('*')
        .eq('session_index', session_index)

      if (error) throw error

      return Users

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async updateCourse(userId: string, courseId: number) {
    try {
      let { data: Users, error } = await this.supabase
        .from('Users')
        .update({ courseId: courseId })
        .eq('id', userId)
        .select()

      if (error) throw error

      return Users

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getConvenerCourse(userId: string) {
    try {
      let { data: Users, error } = await this.supabase
        .from('Users')
        .select(`
          courses:courseId (name)
          `)
        .eq('id', userId)

      if (error) throw error

      return Users

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getConvenerCourseId(userId: string) {
    try {
      let { data: Users, error } = await this.supabase
        .from('Users')
        .select('courseId')
        .eq('id', userId)

      if (error) throw error

      return Users

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async updateCourseConvenerCourse(userId: string, courseId: number) {
    try {
      let { data: Users, error } = await this.supabase
        .from('Users')
        .update({ courseId: courseId })
        .eq('id', userId)

      if (error) throw error

      return Users

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getSessionTokenAndNameId(userId: string) {
    try {
      let { data: Users, error } = await this.supabase
        .from('Users')
        .select('nameId, session_index')
        .eq('id', userId)

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

  async updateUser(user: any) {
    try {
      let { data: Users, error } = await this.supabase
        .from('Users')
        .update(user)
        .eq('id', user.id)

      if (error) throw error


      console.log('Users', Users)
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

  async getTutorApplications(){
    try {
      let { data: Application, error } = await this.supabase
        .from('Application')
        .select('*')
        .is('qualification', null)

      if (error) throw error

      return Application

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getTAApplications(){
    try {
      let { data: Application, error } = await this.supabase
        .from('Application')
        .select('*')
        .is('stuNum', null)

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

  async updateAdminRights(userId: string, adminRights: boolean) {
    try {
      let { status, error } = await this.supabase
        .from('Application')
        .update({ adminRights: adminRights })
        .eq('userId', userId)

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

  async getTutorNameFromApplication(userId: string) {
    try {
      let { data: Application, error } = await this.supabase
        .from('Application')
        .select('name')
        .eq('userId', userId);

      if (error) throw error

      return Application

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

  async getTAsForCourse(courseId: number) {
    try {
      let { data: AssignedTAs, error } = await this.supabase
        .from('Assigned TAs')
        .select(`
          users:userId (id, name, surname, email, role),
          courses:courseId (name)
        `)
        .eq('courseId', courseId)

      if (error) throw error

      return AssignedTAs

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getTACourseAssignedByUserId(userId: string) {
    try {
      let { data: AssignedTAs, error } = await this.supabase
        .from('Assigned TAs')
        .select(`
          courses:courseId (name)`
          )
        .eq('userId', userId)

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

  async getCourseAssignedByUserId(userId: string) {
    try {
      let { data: AssignedTutors, error } = await this.supabase
        .from('Assigned Tutors')
        .select(`
          courses:courseId (name)`
          )
        .eq('userId', userId)

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
        .order('id', { ascending: true })

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

  async getAllEventsFromEventsTable () {
    try {

      let { data: allEvents, error } = await this.supabase
        .from('Events')
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


  async getEventsForCourseID(courseId: number) {
    try {
      let { data: Events, error } = await this.supabase
        .from('Events')
        .select('*')
        .eq('courseId', courseId)

      if (error) throw error

      return Events

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }


  async updateEvents(events: any){
    try {
      let { data, error } = await this.supabase
        .from('Events')
        .upsert(events)
        .select()

      if (error) throw error

      return data

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

  async updateEventTutorCount(eventId: string, countUpdate: number) {
    try {
      // Get the current number of tutors needed
      let { data: Events, error } = await this.supabase
        .from('Events')
        .select('tutorsNeeded')
        .eq('id', eventId);

      if (error || !Events || Events.length === 0) throw error || new Error("Event not found");

      const newTutorCount = Events[0].tutorsNeeded + countUpdate;

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

  async deleteEvent(eventId: number) {
    try {
      let { status, error } = await this.supabase
        .from('Events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      console.log('status', status)
      return status

    } catch (error) {
      console.log('error', error)
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


// ======================================== users table (for uct login) ========================================

  async insertUctUser(user: any) {
    try {

      const { data, error } = await this.supabase
        .from('users')
        .upsert(
          user,
          { onConflict:'nameId' }
        );
        // .upsert(user)
        // .eq('nameId', user.nameId)

      if (error) throw error

      return data

    } catch (error) {
      console.log('error', error)
      throw error;
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

  async deleteTutorFromEvent(eventId: number, userId: string) {
    try {
      let { status, error } = await this.supabase
        .from('Tutors to Events')
        .delete()
        .eq('eventId', eventId)
        .eq('userId', userId)

      if (error) throw error

      return status

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }


  async deleteTutorForEvent(eventId: string, userId: string){
    try {
      let { status, error } = await this.supabase
        .from('Tutors to Events')
        .delete()
        .eq('eventId', eventId)
        .eq('userId', userId)

      if (error) throw error

      return status

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getChosenEvents(userId: string) {
    try {
      let { data: Events, error } = await this.supabase
        .from('Tutors to Events')
        .select(`
          events:eventId (id)
        `)
        .eq('userId', userId)

      if (error) throw error

      return Events

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getAllTutorsToEvents() {
    try {
      let { data: Events, error } = await this.supabase
        .from('Tutors to Events')
        .select('*')

      if (error) throw error

      return Events

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }


  async getAllEventsDetails(userId: string) {
    try {
      let { data: Events, error } = await this.supabase
        .from('Tutors to Events')
        .select(`
          events:eventId (id, courses:courseId (name), day, startTime, endTime, venue, attendancecode, typeOfSession:sessionId (description))
        `)
        .eq('userId', userId)

      if (error) throw error

      return Events

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getTutorsFromEventId(eventId: string) {
    try {
      // let res = await this.supabase
      //   .from('Tutors to Events')
      //   .select(`
      //     users:userId (name, surname, stuNum)
      //   `)
      //   .eq('eventId', eventId)

      // if (error) throw error

      // return Tutors

      let res = await this.supabase
        .from('Tutors to Events')
        .select('userId')
        .eq('eventId', eventId)

      let userIds = res.data.map((item: any) => item.userId)

      let { data: Tutors, error } = await this.supabase
        .from('Application')
        .select('name, surname, stuNum, userId')
        .in('userId', userIds)

      if (error) throw error

      return Tutors

      // console.log('data', Tutors)
      // console.log('userIds', userIds)
      // console.log('res', res)

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }


  // ======================================== File Uploads ========================================

  async uploadFile(file: any, filePath: string) {
    try {
      console.log('file', file)
      const res = await this.supabase
        .storage
        .from('transcripts')
        .upload(filePath, file);

        console.log('res', res)

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

    // ======================================== Announcements ========================================

    async postAnnouncement(courseId: number, heading: string, body: string, isImportant: boolean) {
      try {
        let { status, error } = await this.supabase
          .from('Announcements')
          .insert({ courseId: courseId, announcementHeading: heading, announcementBody: body, important: isImportant })

        if (error) throw error

        return status

      } catch (error) {
        console.log('error', error)
        await this.presentError();
      }
    }

    async getAnnouncements(courseId: number) {
      try {
        let { data: Announcements, error } = await this.supabase
          .from('Announcements')
          .select('*')
          .eq('courseId', courseId)

        if (error) throw error

        return Announcements

      } catch (error) {
        console.log('error', error)
        await this.presentError();
      }
    }





  // ======================================== Attendance Records ========================================
  async updateAttendance(eventId: string, userId: string){
    try {
      let { data, error } = await this.supabase
        .from('Attendance Records')
        .select('*')
        .eq('eventId', eventId)
        .eq('userId', userId)

      if (error) throw error

      let attendanceRecord: any = {
        eventId: eventId,
        userId: userId,
        attendancecount: 0,
      }

      if(data.length){
        attendanceRecord = data[0];

        const last_updated: any = new Date(attendanceRecord.updated_at);
        const currentDate: any = new Date();

        // To calculate the time difference of two dates
        const diffInTime: any = currentDate.getTime() - last_updated.getTime();
        // To calculate the no. of days between two dates
        const diffInDays: any = diffInTime / (1000 * 60 * 60 * 24);

        console.log('diffInDays', diffInDays)

        // Do not allow an update if the record has been updated within the last 5 days
        if(diffInDays <= 5) {
          console.log('Already logged attendance within the last 5 days')
          return 204;
        }
      }

      const newAttendanceRecord = {
        eventId: eventId,
        userId: userId,
        attendancecount: attendanceRecord.attendancecount + 1,
      }

      let { status, error: error2 } = await this.supabase
        .from('Attendance Records')
        .upsert(newAttendanceRecord)

      if (error2) throw error2

      return status

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

  async getAttendanceRecords(eventIds: any){
    try {
      let { data, error } = await this.supabase
        .from('Attendance Records')
        .select(`
          *,
          events:eventId (id, day, startTime, endTime, venue, occurrences, typeOfSession:sessionId (description)),
          user:userId (id, name, surname, email)`
          )
        .in('eventId', eventIds)

      if (error) throw error

      return data

    } catch (error) {
      console.log('error', error)
      await this.presentError();
    }
  }

}
