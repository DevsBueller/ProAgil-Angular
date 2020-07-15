import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventService } from '../_services/event.service';
import { Event } from '../_models/Event';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  title = 'Eventos';
  filtredEvents: Event[];
  events: Event[];
  event: Event;
  imgWidth = 50;
  imgMargin = 2;
  showImage = false;
  deleteMessage: string;
  modoSave: string;

  registerForm: FormGroup;

  constructor(
    private eventService: EventService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService
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
  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }
  editEvent(event: Event, template: any) {
    this.modoSave = 'put';
    this.openModal(template);
    this.event = event;
    this.registerForm.patchValue(event);
  }
  newEvent(template: any) {
    this.modoSave = 'post';
    this.openModal(template);
  }

  ngOnInit() {
    this.events = [];
    this.validation();
    this.getEvents();
  }
  ChangeImage() {
    this.showImage = !this.showImage;
  }
  validation() {
    this.registerForm = this.fb.group({
      theme: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      local: ['', Validators.required],
      eventDate: ['', Validators.required],
      imagemUrl: ['', Validators.required],
      qtPeoples: ['', [Validators.required, Validators.max(120000)]],
      tel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  confirmDelete(confirm: any, event: Event) {
    this.openModal(confirm);
    this.event = event;
    this.deleteMessage = `Tem certeza que deseja excluir o evento: ${event.theme}`;
  }
  deleteEvent(confirm: any) {
    this.eventService.deleteEvent(this.event.id).subscribe(
      (newEvent: Event) => {
        confirm.hide();
        console.log(newEvent);
        this.toastr.success('Deletado com Sucesso');
        this.getEvents();
      },
      (error) => {
        console.log(error);
        this.toastr.error('Erro ao tentar Deletar');
      }
    );
  }
  saveChanges(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSave === 'post') {
        this.event = Object.assign({}, this.registerForm.value);
        this.eventService.postEvent(this.event).subscribe(
          (newEvent: Event) => {
            console.log(newEvent);
            template.hide();
            this.getEvents();
            this.toastr.success('Inserido com Sucesso');
          },
          (error) => {
            console.log(error);
            this.toastr.error('Erro ao tentar inserir: `${error}`');
          }
        );
      } else {
        this.event = Object.assign(
          this.event.id ? { id: this.event.id } : {},
          this.registerForm.value
        );
        this.eventService.putEvent(this.event).subscribe(
          (editedEvent: Event) => {
            console.log(editedEvent);
            template.hide();
            this.getEvents();
            this.toastr.success('Alterado com Sucesso');
          },
          (error) => {
            console.log(error);
            this.toastr.error('Erro ao tentar alterar: `${error}`');
          }
        );
      }
    }
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
        this.toastr.error(`Error ao obter eventos ${error}`);
      }
    );
  }
}
