import { User } from './_models/user';
import { AuthService } from './authService/auth.service';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
   helper = new JwtHelperService();
  constructor(private authService: AuthService) {}

  ngOnInit(){
    const token = localStorage.getItem('token');
    this.authService.decodeToken = this.helper.decodeToken(token ?? '');
    const userAsString = localStorage.getItem('user');
    const user: User = JSON.parse(userAsString!)
    this.authService.currentLoggedInUser = user;
    this.authService.sendMainPhoto(user.photoUrl)
  }

}
