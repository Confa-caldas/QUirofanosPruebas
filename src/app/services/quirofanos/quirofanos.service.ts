import { Injectable } from "@angular/core";
import { ApiRestService } from "../api-rest.service";

@Injectable({
  providedIn: "root",
})
export class QuirofanosService {
  constructor(private rest: ApiRestService) {}

  getDataForm() {
    return this.rest.queryPostFormulario("formularioQx/metodo5", "", true);
  }

  sendForm(body: any) {
    return this.rest.queryPostFormulario("formularioQx/metodo6", body, true);
  }

  getRadicacionRegistrada(body: any) {
    return this.rest.queryPostFormulario("formularioQx/metodo7", body, true);
  }

}
