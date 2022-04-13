import { AlertifyService } from './../../../authService/alertify.service';
import { AuthService } from './../../../authService/auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from './../../../_models/user';
import { UsersService } from './../../../userService/users.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  navPhotoURL: string = ''
  @ViewChild('editForm') editForm?: NgForm;
  user?: User
  constructor(private router: ActivatedRoute , private userService: UsersService , private authService: AuthService , private alertify: AlertifyService) { }

  ngOnInit() {
     this.router.data.subscribe(data => {
       this.user = data['user']
     })
     this.authService.photoURLObervable.subscribe(photoURL => {
        this.navPhotoURL = photoURL
     })
  }

  saveUserInfo(){
    this.userService.updateUser(this.authService.decodeToken.nameid , this.user!).subscribe(() => {
         this.alertify.success('تم حفظ البيانات');
         this.editForm?.reset(this.user);
    },error => {
      this.alertify.error(error);
    });
  }

  receivedEventChangedMainPhoto(url: string){
      this.user!.photoUrl = url;
  }

}
