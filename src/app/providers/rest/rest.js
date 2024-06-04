var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var RestProvider = /** @class */ (function () {
    function RestProvider(http) {
        this.http = http;
        //public apiEventUrl: string = 'http://172.16.8.98:38080/eventoConfaWSS/rest/evento';	
        this.apiEventUrl = 'http://srvdesg4:38080/eventoConfaWSS/rest/evento';
        this.apiUrl = 'http://srvdesg4:38080/ingresoConfaWSS/rest';
        this.http = http;
    }
    RestProvider.prototype.queryGet = function (ruta) {
        var headers = new Headers();
        var options = new RequestOptions({ headers: headers });
        var repos = this.http.get(this.apiUrl.concat(ruta), options);
        return repos;
    };
    RestProvider.prototype.queryPost = function (ruta, body) {
        var headers = new Headers();
        var options = new RequestOptions({ headers: headers });
        var repos = this.http.post(this.apiUrl.concat(ruta), body, options);
        return repos;
    };
    RestProvider.prototype.query = function (ruta, token) {
        var headers = new Headers({ 'Authorization': token });
        var options = new RequestOptions({ headers: headers });
        var repos = this.http.post(this.apiUrl.concat(ruta), '', options);
        return repos;
    };
    /*queryJson(ruta:string,body,token:string)
    {
        let headers = new Headers({ 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        let repos = this.http.post(this.apiUrl.concat(ruta),body, options);
        return repos;
    }*/
    RestProvider.prototype.queryJson = function (ruta, body, apiType) {
        var url = this.apiUrl;
        if (apiType == 2) // If the apiType is '2' we need to take the event url
         {
            url = this.apiEventUrl;
        }
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });
        var repos = this.http.post(url.concat(ruta), body, options);
        return repos;
    };
    RestProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http])
    ], RestProvider);
    return RestProvider;
}());
export { RestProvider };
//# sourceMappingURL=rest.js.map