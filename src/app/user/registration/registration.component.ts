import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  user: User;

  constructor(
    private authService: AuthService,
    public router: Router,
    public fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.validation();
  }
  validation() {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      passwords: this.fb.group(
        {
          password: ['', [Validators.required, Validators.minLength(4)]],
          confirmPassword: ['', Validators.required],
        },
        { validator: this.matchPassword }
      ),
    });
  }

  matchPassword(fb: FormGroup) {
    const confirmPasswordCrtl = fb.get('confirmPassword');
    if (
      confirmPasswordCrtl.errors == null ||
      'mismatch' in confirmPasswordCrtl.errors
    ) {
      if (fb.get('password').value !== confirmPasswordCrtl.value) {
        confirmPasswordCrtl.setErrors({ mismatch: true });
      } else {
        confirmPasswordCrtl.setErrors(null);
      }
    }
  }
  registerUser() {
    if (this.registerForm.valid) {
      this.user = Object.assign(
        { password: this.registerForm.get('passwords.password').value },
        this.registerForm.value);
      this.authService.register(this.user).subscribe(
        () => {
          this.router.navigate(['/user/login']);
          this.toastr.success('Cadastro Realizado');
        }, error => {
          const erro = error.error;
          erro.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Cadastro Duplicado!');
                break;
              default:
                this.toastr.error(`Erro no Cadatro! CODE: ${element.code}`);
                break;
            }
          });
        }

      );
    }
  }
}
