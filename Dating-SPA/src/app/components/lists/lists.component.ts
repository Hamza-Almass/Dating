
import { AlertifyService } from './../../authService/alertify.service';
import { UsersService } from './../../userService/users.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from './../../_models/PaginationResult';
import { User } from './../../_models/user';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

 
  users: User[];
  pagination: Pagination;
  currentUser = JSON.parse(localStorage.getItem('user')!);
  userParams = {minAge: 18 , maxAge: 99 , order: 'lastActive'
  ,gender: (this.currentUser.gender === 'رجل') ? 'إمرأة' : 'رجل',isLikers: false , isLikees: false};
  isPressedLikers = false;

  constructor(private activatedRoute: ActivatedRoute 
    , private userService: UsersService,private alertify: AlertifyService) {
     }

  ngOnInit() {
     this.loadUsers()
  }

  loadUsers(){
     this.activatedRoute.data.subscribe(data => {
       this.users = data['users'].result;
       this.pagination = data['users'].pagination;
       this.getUsers(false)
       this.isPressedLikers = false;
     })
  }

  getUsers(isLikers: boolean){
    this.isPressedLikers = isLikers == true ? true : false;
    this.userParams.isLikers = isLikers == true ? true : false;
    this.userParams.isLikees = isLikers == false ? true : false;
    this.userService.getUsers(this.pagination.currentPage , this.pagination.pageSize,this.userParams).subscribe(
      (res) => {
        this.users = res.result
        this.pagination = res.pagination
      },
      (error) => {
         this.alertify.error(error)
      }
    );

  }



}
