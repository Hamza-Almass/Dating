import { map } from 'rxjs/operators';

import { PaginationResult } from './../_models/PaginationResult';
import { AuthService } from './../authService/auth.service';
import { User } from './../_models/user';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // httpOptions = {
  //   headers: new HttpHeaders({'Authorization':'Bearer ' + localStorage.getItem('token')})
  // }

  baseURL = environment.apiURL
  constructor(private http: HttpClient , private authService: AuthService) { }

  getUsers(pageNumber?: number , pageSize?: number,userParams?: any): Observable<PaginationResult<User[]>>{
    const paginationResult: PaginationResult<User[]>  = new PaginationResult<User[]>();
    let params = new HttpParams();
    
    if (pageNumber != null && pageSize != null){
     params =  params.set('pageNumber' , pageNumber)
     params =  params.set('pageSize' , pageSize);
    }

    if (userParams != null){
      params = params.append('minAge' , userParams.minAge)
      params = params.append('maxAge' , userParams.maxAge)
      params = params.append('gender',userParams.gender)
      params = params.append('orderBy',userParams.order)
      if (userParams.isLikers){
        params = params.append('isLikers',true)
        params = params.append('isLikees',false)
      }else if (userParams.isLikees){
        params = params.append('isLikers',false)
        params = params.append('isLikees',true)
      }else{
        
      }
    }
     return this.http.get<User[]>(this.baseURL + 'users',{observe:'response',params: params}).pipe(
      map(res => {
        paginationResult.result = res.body!;
        if (res.headers.get('pagination') != null){
          paginationResult.pagination = JSON.parse(res.headers.get('pagination')!);
        }
        return paginationResult;
      })
    );
  }

  getUser(id: any): Observable<User>{
    return this.http.get<User>(this.baseURL + 'users/' + id);
  }

  updateUser(id: any , user: User){
    return this.http.put(this.baseURL + 'users/' + id , user);
  }

  setMainPhoto(photoId: number){
    return this.http.post(this.baseURL + 'users/' + this.authService.decodeToken.nameid + '/photos/' + photoId + '/setMain',{})
  }

  deletePhoto(photoId: number){
     return this.http.delete(this.baseURL + 'users/' + this.authService.decodeToken.nameid + '/photos/' + photoId);
  }

  sendLike(currentUserId: number , recepiantId: number) {
    return this.http.post(this.baseURL + 'users/' + currentUserId + '/like/' + recepiantId,{})
  }

}
