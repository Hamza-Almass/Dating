import { User } from './../../../_models/user';
import { AlertifyService } from './../../../authService/alertify.service';
import { UsersService } from './../../../userService/users.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css']
})
export class CardDetailsComponent implements OnInit {
  
  galleryOptions:  NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  user?: User
  constructor(private userService: UsersService , private alertify: AlertifyService , private router: ActivatedRoute) { }

  ngOnInit() {
    this.loadUser()
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

    this.galleryImages = this.getImages();

  }

  getImages(){
    const images = [];
    for (var i = 0 ; i < this.user!.photos!.length ; i++){
      if ((this.user!.photos![i].url) != null){
        images.push({small: this.user!.photos![i].url , medium: this.user!.photos![i].url,big: this.user!.photos![i].url});
      }
       
    }
    console.log(images.length);
    return images;
  }

  loadUser(){
     this.router.data.subscribe(data => {
      this.user = data['user']
    })
  }

}
