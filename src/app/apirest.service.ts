import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApirestService {

  //public apiUrl: string = 'http://localhost:8000/api/v1/';  //Url test api
  public apiUrl: string = 'http://app.confa.co:8321/';  //Url production api

  constructor(private http: HttpClient) {
    this.http = http;
  }

  /**
  *
  **/
  queryPostRegular(route: string, body) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    let repos = this.http.post(this.apiUrl.concat(route), body, { headers: headers });
    return repos;
  }

  queryGet(route: string) {
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Authorization', token);
    let repos = this.http.get(this.apiUrl.concat(route), { headers: headers });
    return repos;
  }

  queryPost(route: string, body) {
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Authorization', token);
    headers = headers.append('Content-Type', 'application/json');
    let repos = this.http.post(this.apiUrl.concat(route), body, { headers: headers });
    return repos;
  }

  queryDelete(route: string) {
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Authorization', token);
    let repos = this.http.delete(this.apiUrl.concat(route), { headers: headers });
    return repos;
  }

  queryExternalApi(route) {
    let repos = this.http.get(route);
    return repos;
  }
}