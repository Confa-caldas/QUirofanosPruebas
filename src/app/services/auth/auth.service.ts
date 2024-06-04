import { Injectable, EventEmitter, Output } from "@angular/core";
import * as moment from "moment";
import { BehaviorSubject } from "rxjs";
import { Validators } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  @Output() showHideloginModal: EventEmitter<boolean> = new EventEmitter();

  @Output() _closeSession: EventEmitter<boolean> = new EventEmitter();

  @Output() _openModaalValidateDocument: EventEmitter<boolean> = new EventEmitter();

  @Output() _openModalRegisterUser: EventEmitter<object> = new EventEmitter();

  constructor() {}

  isAuthenticated(): boolean {
    const health_token = localStorage.getItem("htoken");

    if (health_token) {
      return true;
    } else {
      return false;
    }
  }

  openLoginModal(_value: boolean) {
    this.showHideloginModal.emit(_value);
  }

  closeSession(_value: boolean) {
    this._closeSession.emit(_value);
  }

  openModalValidateDocument(_value: boolean) {
    this._openModaalValidateDocument.emit(_value);
  }

  openModalRegister(_value: boolean, _data: object) {
    let data = {
      value: _value,
      data: _data,
    };

    this._openModalRegisterUser.emit(data);
  }
}
