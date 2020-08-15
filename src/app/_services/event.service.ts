import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventModel } from '../_models/event-model';
import { eventNames } from 'process';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  baseURL = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(this.baseURL);
  }
  getEventsByTheme(theme: string): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(`${this.baseURL}/getByTheme/${theme}`);
  }
  getEventById(id: number): Observable<EventModel> {
    return this.http.get<EventModel>(`${this.baseURL}/${id}`);
  }
  postUpload(file: File, fileName: string) {
    const fileToUpload = <File>file[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileName);

    return this.http.post(`${this.baseURL}/upload`, formData);
  }
  postEvent(event: EventModel) {
    return this.http.post(this.baseURL, event);
  }
  putEvent(event: EventModel) {
    return this.http.put(`${this.baseURL}/${event.id}`, event);
  }
  deleteEvent(id: number) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }
}
