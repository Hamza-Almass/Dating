import { PaginationResult } from './../_models/PaginationResult';
import { catchError} from 'rxjs/operators';
import { from, Observable,of } from 'rxjs';
import { AlertifyService } from '../authService/alertify.service';
import { UsersService } from '../userService/users.service';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

@Injectable()
export class MemberListResolver implements Resolve<PaginationResult<User[]>> {
    pageNumber: number = 1;
    pageSize: number = 6;
    constructor(private router: Router , private userService: UsersService , private alertify: AlertifyService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<PaginationResult<User[]>>{
        return this.userService.getUsers(this.pageNumber,this.pageSize).pipe(
            catchError(error => {
                this.alertify.error(error)
                this.router.navigate([''])
                return from([]);
            })
        );
    }

}