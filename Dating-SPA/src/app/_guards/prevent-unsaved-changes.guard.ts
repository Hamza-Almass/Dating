import { AlertifyService, ConfirmResult } from './../authService/alertify.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditComponent } from '../components/member/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {

  x = false;
  constructor(private alertify: AlertifyService) {}

   async canDeactivate(component: MemberEditComponent){
     if (component.editForm?.dirty) {
       const confirm = await this.alertify.promifisyConfirm('انتباه','لديك بينات لم تقم بحفظها هل تريد الاستمرار؟',{});
       if (confirm == ConfirmResult.Ok){
         this.x = true;
       }else{
         this.x = false;
       }
       return this.x;
     }
     return true;
  }

}
