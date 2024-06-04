import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as _globals from "src/environments/environment";
import { map } from "rxjs/operators";

@Injectable()
export class RestProvider {
  private apiEventUrl: string = _globals.pathEvents.urlHealth;
  private apiUrl: string = _globals.api.authConfa;
  private apiAcommodtions: string = _globals.api.acommodation;
  private pagosPasarela: string = _globals.api.payments;

  constructor(private http: HttpClient) {}

  queryGet(ruta: string) {
    return this.http.get(this.apiUrl.concat(ruta));
  }

  queryPost(ruta: string, body) {
    return this.http.post(this.apiUrl.concat(ruta), body);
  }

  queryAuth(ruta: string, body, apiType, token) {
    let url = this.apiUrl;
    if (apiType == 2) {
      url = this.apiEventUrl;
    }

    const headers = new HttpHeaders({ Authorization: token, "Content-Type": "application/json" });
    return this.http.post(url.concat(ruta), body, { headers });
  }
  queryJson(ruta: string, body, apiType, token = null) {
    let url = this.apiUrl;
    if (apiType == 2) {
      url = this.apiEventUrl;
    } else if (apiType == 3) {
      url = this.apiAcommodtions;
    }
  
    let headers = new HttpHeaders({ "Content-Type": "application/json" });
    if (token) {
      headers = headers.set('Authorization', token);
    }
    return this.http.post(url.concat(ruta), body, { headers });
  }

  queryJsonprovi(ruta: string, body, apiType, token = null) {
    let url = this.apiUrl;
    if (apiType == 2) {
      url = this.apiEventUrl;
    } else if (apiType == 3) {
      url = this.apiAcommodtions;
    }

    const headers = new HttpHeaders({ Authorization: token, "Content-Type": "application/json" });
    return this.http.post(url.concat(ruta), body, { headers });
  }

  queryGetprovi(ruta: string, token = null) {
    let url = this.apiAcommodtions;
    const headers = new HttpHeaders({ Authorization: token, "Content-Type": "application/json" });
    return this.http.get(url.concat(ruta), { headers });
  }

  queryPasarela(ruta: string, body, token) {
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.post(this.pagosPasarela.concat(ruta), body, { headers });
  }

  private getQuery(query: string, body: any) {
    const url = `${this.apiUrl}${query}`;
    return this.http.post(url, body);
  }

  login(token: string) {
    let bodyToken = {
      token: token.toString(),
    };

    return this.getQuery("/confa/metodo23", bodyToken).pipe(
      map((response) => {
        return response;
      })
    );
  }

  validateToken(token: string) {
    let bodyValidateToken = {
      token: token.toString(),
    };

    return this.getQuery("/validarToken", bodyValidateToken).pipe(
      map((response) => {
        return response;
      })
    );
  }
}