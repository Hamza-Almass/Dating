import { ListsComponent } from './components/lists/lists.component';

import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { CardEditResolver } from './_resolver/card-edit.resolver';
import { MemberEditComponent } from './components/member/member-edit/member-edit.component';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { CardDetailsResolver } from './_resolver/card-details.resolver';
import { CardDetailsComponent } from './components/member/card-details/card-details.component';

import { MemberListComponent } from './components/member/member-list/member-list.component';
import { UsersService } from './userService/users.service';
import { AlertifyService } from './authService/alertify.service';
import { ErrorInterceptor } from './authService/error.interceptor';
import { AuthService } from './authService/auth.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './_guards/auth.guard';
import { CardComponent } from './components/member/card/card.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PhotoEditComponent } from './components/member/photo-edit/photo-edit.component';
import { TimeagoModule } from 'ngx-timeago';
import { PaginationModule } from 'ngx-bootstrap';


export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [				
    AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      CardComponent,
      CardDetailsComponent,
      MemberEditComponent,
      PhotoEditComponent,
      ListsComponent
     
   ],
   exports:[],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxGalleryModule,
    FileUploadModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    TimeagoModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5000"],
        disallowedRoutes: ["http://localhost:5000/api/auth"],
      },
    }),
  ],
  providers: [AuthService,{provide: HTTP_INTERCEPTORS,useClass: ErrorInterceptor,multi: true}
    ,AlertifyService,AuthGuard,PreventUnsavedChangesGuard,UsersService , CardDetailsResolver , MemberListResolver,CardEditResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
