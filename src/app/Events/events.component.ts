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
  file: File;
  fileNameToUpdate: string;
  currentDate: string;

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
    this.event = Object.assign({}, event);
    this.fileNameToUpdate = event.imagemUrl.toString();
    this.event.imagemUrl = '';
    this.registerForm.patchValue(this.event);
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
  uploadImage() {
    if (this.modoSave === 'post') {
      const fileName = this.event.imagemUrl.split('\\', 3);
      this.event.imagemUrl = fileName[2];
      this.eventService
        .postUpload(this.file, this.event.imagemUrl)
        .subscribe(() => {
          this.currentDate = new Date().getMilliseconds().toString();
          this.getEvents();
        });
    } else {
      this.event.imagemUrl = this.fileNameToUpdate;
      this.eventService
        .postUpload(this.file, this.fileNameToUpdate)
        .subscribe(() => {
          this.currentDate = new Date().getMilliseconds().toString();
          this.getEvents();
        });
    }
  }
  saveChanges(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSave === 'post') {
        this.event = Object.assign({}, this.registerForm.value);
        this.uploadImage();
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

        this.uploadImage();
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
  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
      console.log(this.file);
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
