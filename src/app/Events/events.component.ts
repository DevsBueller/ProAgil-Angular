import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventService } from '../_services/event.service';
import { Event } from '../_models/Event';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  filtredEvents: Event[];
  events: Event[];
  imgWidth = 50;
  imgMargin = 2;
  showImage = false;
  modalRef: BsModalRef;

  constructor(
    private eventService: EventService,
    private modalService: BsModalService
  ) {}

  _listFilter: string;

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filtredEvents = this.listFilter
      ? this.filterEvents(this.listFilter)
      : this.events;
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    this.getEvents();
  }
  ChangeImage() {
    this.showImage = !this.showImage;
  }
  filterEvents(filterBy: string): Event[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.events.filter(
      (event) => event.theme.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }
  getEvents() {
    this.eventService.getAllEvents().subscribe(
      (_events: Event[]) => {
        this.events = _events;
        this.filtredEvents = this.events;
        console.log(_events);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
