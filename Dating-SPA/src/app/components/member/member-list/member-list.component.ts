import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from './../../../authService/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../../authService/alertify.service';
import { User } from '../../../_models/user';
import { UsersService } from '../../../userService/users.service';
import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/_models/PaginationResult';
import { PageChangedEvent } from 'ngx-bootstrap';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  
  filterForm: FormGroup;
  users: User[] = [];
  currentUser = JSON.parse(localStorage.getItem('user')!)
  pagination: Pagination
  listOfGenders = [{
    type: 'رجل',displayName: 'رجال'
  },{type: 'إمرأة' , displayName: 'نساء'}]

  constructor(private authService: AuthService, private userService: UsersService
     , private route: ActivatedRoute , private alertifyService: AlertifyService,private fb: FormBuilder) {
      this.filterForm =  this.fb.group({
        gender:  (this.currentUser.gender === 'رجل') ? 'إمرأة' : 'رجل',
        minAge: 18,
        maxAge:99,
        order:'lastActive',
        isLikers: false,
        isLikees: false
      });
      
    }

  ngOnInit() {
   
    this.getUsers()
    this.loadUsers()
     this.authService.currentLoggedInUser = JSON.parse(localStorage.getItem('user')!)
     this.authService.sendMainPhoto(JSON.parse(localStorage.getItem('user')!).photoUrl)
  }

  getUsers(){
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination
    });
  }

  pageChanged(obj: PageChangedEvent){
    this.pagination.currentPage = obj.page
     this.loadUsers()
  }

  loadUsers(){
    this.userService.getUsers(this.pagination.currentPage,6,this.filterForm.value).subscribe(res => {
      this.users = res.result
      this.pagination = res.pagination
  })
  }

  resetFilter(){
    this.filterForm =  this.fb.group({
      gender:  (this.currentUser.gender === 'رجل') ? 'إمرأة' : 'رجل',
      minAge: 18,
      maxAge:99
    });
    this.loadUsers()
  }

}
