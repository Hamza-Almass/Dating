import { Router } from '@angular/router';
import { AlertifyService } from '../../authService/alertify.service';
import { AuthService } from '../../authService/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  colorTheme = 'theme-green';
  bsConfigDP: Partial<BsDatepickerConfig>;
  @Output() cancelRegisterEvent = new EventEmitter();
  registerForm: FormGroup;
  model: any = {};
  constructor(private authService: AuthService , private alertifyService: AlertifyService , private fb: FormBuilder , private router: Router) { }

  ngOnInit() {
    this.bsConfigDP = {containerClass: this.colorTheme,dateInputFormat: 'YYYY-MM-DD',showWeekNumbers: false}
    this.prepareFormGroup()
  }

  prepareFormGroup(){
   this.registerForm = this.fb.group({
     gender: [''],
     username: ['',[Validators.required]],
     knownAs:['',[Validators.required]],
     city:['',Validators.required],
     country: ['',Validators.required],
     dateOfBirth:['',Validators.required],
     password: ['',[Validators.required , Validators.minLength(4),Validators.maxLength(8)]],
     confirmPassword: ['',[Validators.required]]
   },{validator: this.checkPasswordMatchWithConfirmPassword});
  }

  checkPasswordMatchWithConfirmPassword(form: FormGroup) {
     return form.get('password')!.value === form.get('confirmPassword')!.value ? null : {'mismatch': true};
  }

  register(){
    this.authService.register(this.registerForm.value).subscribe(
      (res: any) => {
      },
      (error) => {
        this.alertifyService.error(error);
      },
      () => {
        this.authService.login(this.registerForm.value).subscribe(
          () => {
            this.router.navigate(['members'])
            this.authService.currentLoggedInUser = this.registerForm.value
          }
        )
      }
    );
  }

  cancelRegister(){
    this.cancelRegisterEvent.emit(false);
  }

}
