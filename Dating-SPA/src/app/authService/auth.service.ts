import { User } from './../_models/user';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{

decodeToken: any;
helper = new JwtHelperService();
baseURL = environment.apiURL;
currentLoggedInUser: User;
private photoURLObserver = new BehaviorSubject('');
photoURLObervable = this.photoURLObserver.asObservable();

sendMainPhoto(newPhotoURL: string){
   this.photoURLObserver.next(newPhotoURL);
}
ngOnInit(): void {
  this.photoURLObserver.next(JSON.parse(localStorage.getItem('user')!).photoUrl)
}

constructor(private http: HttpClient) {}

login(data: any){
    return this.http.post(this.baseURL + 'auth/login',data)
    .pipe(map((response: any) => {
        const user = response;
        if (user) localStorage.setItem('token' , user.token);
        console.log(user)
        this.decodeToken = this.helper.decodeToken(user.token);
        if (user.user){
           this.currentLoggedInUser = user.user;
           localStorage.setItem('user' , JSON.stringify(user.user));
        }
    }));
}

register(data: any) {
  return this.http.post(this.baseURL + 'auth/register' , data)
}

isLoggedInt(){
  try {
    const token = localStorage.getItem('token');
    return ! this.helper.isTokenExpired(token ?? '');
  }catch{
    return false;
  }

}

}
