import { catchError} from 'rxjs/operators';
import { from, Observable,of } from 'rxjs';
import { AlertifyService } from './../authService/alertify.service';
import { UsersService } from './../userService/users.service';
import { User } from './../_models/user';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

@Injectable()
export class CardDetailsResolver implements Resolve<User> {
    
    constructor(private router: Router , private userService: UsersService , private alertify: AlertifyService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<User>{
        return this.userService.getUser(route.params['id']).pipe(
            catchError(error => {
                this.alertify.error(error)
                this.router.navigate(['/members'])
                return from([]);
            })
        );
    }

}