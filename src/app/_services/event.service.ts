import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../_models/Event';
import { eventNames } from 'process';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  baseURL = 'http://localhost:5000/api/events';
  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseURL);
  }
  getEventsByTheme(theme: string): Observable<Event[]> {
    return this.http.get<Event[]>('${this.baseURL}/getByTheme/${theme}');
  }
  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>('${this.baseURL}/${id}');
  }
  postEvent(event: Event) {
    return this.http.post(this.baseURL, event);
  }
  putEvent( event: Event) {
    return this.http.put(`${this.baseURL}/${event.id}`, event);
  }
   deleteEvent( id: number) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }
}
