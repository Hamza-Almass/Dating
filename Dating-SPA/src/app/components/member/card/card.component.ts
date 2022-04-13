import { AuthService } from './../../../authService/auth.service';
import { AlertifyService } from './../../../authService/alertify.service';
import { UsersService } from './../../../userService/users.service';
import { User } from './../../../_models/user';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  photoUrl: string
  @Input() user?: User;
  constructor(private userService: UsersService , private alertify: AlertifyService , private authService: AuthService) { }

  ngOnInit() {
    if (this.user?.photoUrl != null){
      this.photoUrl = this.user.photoUrl
    }else{
      this.photoUrl = "../../../../assets/user.png"
    }
  }

  sendLike(reciepiantId: number) {
      this.userService.sendLike(this.authService.decodeToken.nameid , reciepiantId).subscribe(
        () => {this.alertify.success('You are liked ' + this.user?.knownAs)},
        (error) => {this.alertify.error(error)}
      );
  }

}
