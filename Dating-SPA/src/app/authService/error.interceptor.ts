import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
         catchError(error => {

          if (error instanceof HttpErrorResponse){
            // If we get the internal server error
            const applicationError = error.headers.get('Application-Error');
            if (applicationError){
              return throwError(applicationError);
            }

            // Handle bad request
            const serverError = error.error;
            let modelStateError = '';
            if (serverError && typeof serverError  ==='object'){
                for (const key in serverError.errors){
                  modelStateError += serverError.errors[key] + '\n';
                }
            }

            // Handle unauthorized
            if (error.status === 401) {
              return throwError(error.statusText + ' Username or password are incorrect');
            }
  
            return throwError(modelStateError || serverError || 'Server error');
          
          }

           return throwError('Nothing');
         
         })
    );
  }
}
