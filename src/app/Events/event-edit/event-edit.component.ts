import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { EventService } from 'src/app/_services/event.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { EventModel } from 'src/app/_models/event-model';
@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {
  title = 'Editar Eventos';
  imageUrl = 'assets/img/upload.png';
  event: EventModel = new EventModel();
  registerForm: FormGroup;
  file:File;
  fileNameToUpdate:string;
  currentDate = '';
  constructor(
    private eventService: EventService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.validation();
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
  onFileChange(evento: any, file: FileList) {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imageUrl = event.target.result;

    this.file = evento.target.files;
    reader.readAsDataURL(file[0]);
  }

}
