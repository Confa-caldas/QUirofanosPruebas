import { Injectable, EventEmitter, Output } from "@angular/core";
import * as moment from "moment";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject } from "rxjs";
import { Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class UtilitiesService {
  @Output() _toggleSplashscreen: EventEmitter<object> = new EventEmitter();
  @Output() _showErrorsModal: EventEmitter<object> = new EventEmitter();
  @Output() _showConfirmModal: EventEmitter<object> = new EventEmitter();
  @Output() _responseModalConfirm: EventEmitter<boolean> = new EventEmitter();
  @Output() setStepBreadCrumbs: EventEmitter<number> = new EventEmitter();
  @Output() showHideUserAppointment: EventEmitter<boolean> = new EventEmitter();
  validateToken: boolean = false;
  showModalInfo: boolean = true;
  message: string;
  message2: string;
  messageTitleModal: string = null;
  messageModal: string = null;
  messageModal2: string = null;
  messageModal3: string = null;
  messageModal4: string = null;

  constructor(private router: Router, private cookieService: CookieService) {}

  setLocalSession(data: object, name: string) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  geLocalSessionData(name) {
    let response = localStorage.getItem(name);

    if (!response) {
      return;
    }
    return JSON.parse(response);
  }

  getLocalSession() {
    let user = localStorage.getItem("user_health");

    if (!user) {
      return;
    }

    return JSON.parse(user);
  }

  getTokenSession() {
    let token = localStorage.getItem("htoken");
    if (!token) {
      return;
    }
    return JSON.parse(token);
  }

  destroyLocalSession(name: string) {
    localStorage.removeItem(name);
  }

  convertDateFormat(_date: any, _format: string) {
    const year = _date.year;
    const month = _date.month;
    const day = _date.day;

    let date = year + "/" + month + "/" + day;

    if (year && month && day) {
      return moment(date).format(_format);
    } else {
      return moment(_date).format(_format);
    }
  }

  convertDateObject(_date: string) {
    let date: Object = {
      date: {
        year: parseInt(_date.split("-")[0]),
        month: parseInt(_date.split("-")[1]),
        day: parseInt(_date.split("-")[2]),
      },
    };

    return date;
  }

  toggleSplashscreen(_value: boolean, _message: String = null) {
    let data = {
      value: _value,
      message: _message,
    };

    this._toggleSplashscreen.emit(data);
  }

  showErrorsModal(_value: boolean, _message: String) {
    let object = {
      res: _value,
      message: _message,
    };
    this._showErrorsModal.emit(object);
  }

  showConfirmModal(_value: boolean, _title: String, _message: String, _message2: String) {
    let object = {
      res: _value,
      title: _title,
      message: _message,
      message2:_message2
    };
    this._showConfirmModal.emit(object);
  }

  responseConfirmModal(res: boolean) {
    this._responseModalConfirm.emit(res);
  }

  validateEmail(_value: string) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(_value);
  }

  validateExtension(limit: number, _value: String) {
    if (_value.length > limit) {
      return true;
    }
    return false;
  }

  validateNumber(_value: string) {
    let regex = /^[0-9]+$/;
    return regex.test(_value);
  }

  getStepBreadCrumbs(_value: number) {
    this.setStepBreadCrumbs.emit(_value);
  }

  getshowHideAppointmenUser(_value: boolean) {
    this.showHideUserAppointment.emit(_value);
  }

  setTimeOnboarding(type: string) {
    let n = moment().add(1, "days").unix();
    localStorage.setItem(type, n.toString());
  }

  getTimeOnBording(type) {
    let time = localStorage.getItem(type);
    if (!time) {
      return;
    }

    return time;
  }

  logout() {
    this.cookieService.delete("ptoken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("health");
    localStorage.removeItem("user_agreements");
    localStorage.removeItem("user_health");
    localStorage.removeItem("htoken");
    localStorage.removeItem("gtoken");
    localStorage.removeItem("form");
    this.router.navigate(["/quirofanos"]);
  }
}
