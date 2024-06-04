import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import * as _globals from "../../environments/environment";
import { UtilitiesService } from "./general/utilities.service";

@Injectable({
  providedIn: "root",
})
export class ApiRestService {
  constructor(public http: HttpClient, private ut: UtilitiesService) {
    this.http = http;
  }

  queryPost(route: string, body, token): Observable<any> {
    let headers = new HttpHeaders();
    if (token) {
      let tokenData = localStorage.getItem("gtoken");
      headers = headers.set("Authorization", tokenData);
    }
    let params = new HttpParams();
    return this.http.post(
      _globals.api.urlHealth + route,
      body,
      { headers: headers, params: params }
    );
  }

  queryPostFormulario(route: string, body, token): Observable<any> {
    let headers = new HttpHeaders();
    if (token) {
      let tokenData = localStorage.getItem("gtoken");
      headers = headers.set("Authorization", tokenData);
    }
    let params = new HttpParams();
    return this.http.post(
      _globals.api.urlHealth + route,
      body,
      { headers: headers, params: params }
    );
  }
}