import { AlertifyService } from './../authService/alertify.service';
import { AuthService } from './../authService/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService , private alertify: AlertifyService , private router: Router) {}

  canActivate(): boolean  {
    if (this.authService.isLoggedInt()){
      return true;
    }
    this.router.navigate(['']);
    this.alertify.error('يرجى التسجيل او الدخول اولا');
    return false;
  }
  
}
