import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { EventService } from 'src/app/_services/event.service';

import { ToastrService } from 'ngx-toastr';
import { EventModel } from 'src/app/_models/event-model';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css'],
})
export class EventEditComponent implements OnInit {
  title = 'Editar Eventos';
  imageUrl = 'assets/img/upload.png';
  event: EventModel = new EventModel();
  registerForm: FormGroup;
  file: File;
  fileNameToUpdate: string;
  currentDate = '';

  get lots(): FormArray {
    return <FormArray>this.registerForm.get('lots');
  }
  get socialNetworks(): FormArray {
    return <FormArray>this.registerForm.get('socialNetworks');
  }
  constructor(
    private eventService: EventService,
    private fb: FormBuilder,
    private localService: BsLocaleService,
    private toastr: ToastrService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadEvent();
    this.validation();

  }
  loadEvent() {
    const idEvent = +this.router.snapshot.paramMap.get('id');
    this.eventService.getEventById(idEvent).subscribe((event: EventModel) => {
      this.event = Object.assign({}, event);
      this.fileNameToUpdate = event.imagemUrl.toString();
      this.imageUrl = `http://localhost:5000/resources/images/${this.event.imagemUrl}?_ts=${this.currentDate}`;
      this.event.imagemUrl = '';
      this.registerForm.patchValue(this.event);
      this.event.lots.forEach((lot) => {
        this.lots.push(this.createLot(lot));
      });
      this.event.socialNetworks.forEach((socialNetwork) => {
        this.socialNetworks.push(this.createSocialNetwork(socialNetwork));
      });
      console.log(this.event);
    });
  }

  validation() {
    this.registerForm = this.fb.group({
      id: [],
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
      imagemUrl: [''],
      qtPeoples: ['', [Validators.required, Validators.max(120000)]],
      tel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lots: this.fb.array([]),
      socialNetworks: this.fb.array([]),
    });
  }
  saveEvent() {
    this.event = Object.assign({ id: this.event.id }, this.registerForm.value);
    this.event.imagemUrl = this.fileNameToUpdate;

    this.uploadImage();

    this.eventService.putEvent(this.event).subscribe(
      (editedEvent: Event) => {
        console.log(editedEvent);
        this.toastr.success('Alterado com Sucesso');
      },
      (error) => {
        console.log(error);
        this.toastr.error('Erro ao tentar alterar: `${error}`');
      }
    );
  }
  uploadImage() {
    if (this.registerForm.get('imagemUrl').value !== '') {
      this.eventService
        .postUpload(this.file, this.fileNameToUpdate)
        .subscribe(() => {
          this.currentDate = new Date().getMilliseconds().toString();
          this.imageUrl = `http://localhost:5000/resources/images/${this.event.imagemUrl}?_ts=${this.currentDate}`;
        });
    }
  }
  createLot(lot: any): FormGroup {
    const pipe = new DatePipe('en-US');
    return this.fb.group({
      id: [lot.id],
      name: [lot.name, Validators.required],
      quantity: [lot.quantity, Validators.required],
      price: [lot.price, Validators.required],
      beginDate: [pipe.transform(lot.beginDate, 'dd/MM/yyyy')],
      finalDate: [pipe.transform(lot.finalDate, 'dd/MM/yyyy')],
    });
  }
  createSocialNetwork(socialNetwork: any): FormGroup {
    return this.fb.group({
      id: [socialNetwork.id],
      name: [socialNetwork.name, Validators.required],
      url: [socialNetwork.url, Validators.required],
    });
  }
  addLots() {
    this.lots.push(this.createLot({ id: 0 }));
  }
  removeLot(id: number) {
    this.lots.removeAt(id);
  }

  addSocialNetwork() {
    this.socialNetworks.push(this.createSocialNetwork({ id: 0 }));
  }
  removeSocialNetwork(id: number) {
    this.socialNetworks.removeAt(id);
  }

  onFileChange(evento: any, file: FileList) {
    const reader = new FileReader();

    reader.onload = (event: any) => (this.imageUrl = event.target.result);

    this.file = evento.target.files;
    reader.readAsDataURL(file[0]);
  }
}
