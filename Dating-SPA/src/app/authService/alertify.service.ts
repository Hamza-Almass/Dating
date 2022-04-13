import { Injectable } from '@angular/core';


declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }

promifisyConfirm(title: string , message: string , options: {}): Promise<ConfirmResult>{

  return new Promise<ConfirmResult>((resolve) => {
    alertify.confirm(title , message , () => resolve(ConfirmResult.Ok),() => resolve(ConfirmResult.cancel))
    .set(Object.assign({},{
      closableByDimmer: false,
      defaultFocus: 'cancel',
      frameless: false,
      closable: false
    },options));
  });

}



message(message: string){
  alertify.message(message);
}

warning(message: string){
  alertify.warning(message);
}

error(message: string){
  alertify.error(message)
}

success(message: string){
  alertify.success(message);
}

}

export enum ConfirmResult {
   Ok = 1,
   cancel 
}