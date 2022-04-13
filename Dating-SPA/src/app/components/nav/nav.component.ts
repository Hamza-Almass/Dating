import { AlertifyService } from '../../authService/alertify.service';
import { AuthService } from '../../authService/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  navPhotoURL: string = '';
  model: any = {};
  constructor(public authService: AuthService , private alertifyService: AlertifyService , private router: Router) { }

  ngOnInit() {
    this.authService.photoURLObervable.subscribe(photoURL => {
      this.navPhotoURL = photoURL
    })
  }

  login(){
    this.authService.login(this.model).subscribe(
      next => {
        
        this.alertifyService.success('تم الدخول بنجاح')
        this.router.navigate(['members']);
      },
      error => {this.alertifyService.error(error)}
    );
  }

  loggedIn(){
    return this.authService.isLoggedInt();
  }

  loggedOut(){
    localStorage.removeItem('token');
    this.authService.decodeToken = null
    localStorage.removeItem('user')
    this.router.navigate(['']);
    this.alertifyService.message('تم الخروج بنجاح');
  }

}
