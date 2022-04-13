import { AlertifyService } from './../../../authService/alertify.service';
import { UsersService } from './../../../userService/users.service';
import { AuthService } from './../../../authService/auth.service';
import { Photo } from './../../../_models/photo';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileUploader } from 'ng2-file-upload';


@Component({
  selector: 'app-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.css']
})
export class PhotoEditComponent implements OnInit {

  baseAPI = environment.apiURL;

  uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  response:string = ""
  @Input() photos: any;
  @Output() eventChangedMainPhoto = new EventEmitter<string>();

  constructor(private authService: AuthService , private userService: UsersService , private alertify: AlertifyService) {}

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseAPI + 'users/' + this.authService.decodeToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      maxFileSize: 10 * 1048 * 1048,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (file , res , status , header) => {
      if (res) {
        const photoAsJson = JSON.parse(res);
        const photo = {
           id: photoAsJson.id,
           url: photoAsJson.url,
           addedDate: photoAsJson.addedDate,
           isMain: photoAsJson.isMain
        }
        if (photo.isMain){
          this.authService.sendMainPhoto(photo.url);
          this.authService.currentLoggedInUser.photoUrl = photo.url;
          localStorage.setItem('user' , JSON.stringify(this.authService.currentLoggedInUser))
        }
        this.photos.push(photo);
      }
    }
  }

  ngOnInit(): void {
    this.initializeUploader()
    this.hasBaseDropZoneOver = false;
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  setMain(photo: any){
     
     this.userService.setMainPhoto(photo.id).subscribe(
       (res:any) => {
       
        // Set all the images to false
         for(var i = 0 ; i < this.photos.length ; i++){
              this.photos[i].isMain = false;
         }
         // Then set the selected photo to main
         photo.isMain = true;
         this.authService.sendMainPhoto(photo.url);
         this.authService.currentLoggedInUser.photoUrl = photo.url;
         localStorage.setItem('user' , JSON.stringify(this.authService.currentLoggedInUser))
  
        },
        (error) => {
          this.alertify.error(error);
        }
     );
  }

  deletePhoto(photoId: number){
     this.userService.deletePhoto(photoId).subscribe(
       () => {
         var myPhotos = this.photos as Photo[];
         myPhotos.splice(myPhotos.findIndex(p => p.id == photoId),1);
         this.photos = myPhotos;
       },
       error => {
         this.alertify.error(error);
       }
     );
  }
 
 
}
