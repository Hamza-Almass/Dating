import { Router } from '@angular/router';
import { AuthService } from './../../authService/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode: boolean = false;
  constructor(private http: HttpClient , private authService: AuthService , private router: Router) { }

  ngOnInit() {
    // To navigate if the user logged in 
   if (this.authService.isLoggedInt()){
     this.router.navigate(['/members'])
   }
  }

  toggleToRegister(){
    this.registerMode = !this.registerMode;
  }

 cancelRegister(mode: boolean){
    this.registerMode = mode
 }

}
