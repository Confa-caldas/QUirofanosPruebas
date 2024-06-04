import { Injectable, Output, EventEmitter } from "@angular/core";
import { ApiRestService } from "../api-rest.service";
import { RestProvider } from "../../providers/rest/rest";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public authRoute = "authVac";

  @Output() _getUserHealth: EventEmitter<object> = new EventEmitter();

  constructor(private rest: ApiRestService, private provider: RestProvider) {}

  createSessionUser(data: object, prefix: string = null) {
    let name = "user";
    if (prefix) {
      name = "user_" + prefix;
    }
    localStorage.setItem(name, JSON.stringify(data));
  }

  getGeneralToken() {
    let gtoken = localStorage.getItem("gtoken");
    if (!gtoken) {
      return;
    }

    return gtoken;
  }

  getSessionUser() {
    let user = localStorage.getItem("user");
    if (!user) {
      return;
    }

    return JSON.parse(user);
  }

  updatedSessionUser(data) {
    let user = JSON.parse(localStorage.getItem("user"));
    user["celular"] = data.celular;
    user["direccion"] = data.direccion;
    user["fechaNacimiento"] = data.fechaNacimiento;
    user["telefono"] = data.telefono;
    user["tipoDocumento"] = data.tipoDocumento;

    localStorage.setItem("user", JSON.stringify(user));
  }

  checkIfUserHaveServiceHealth(body: object) {
    return this.rest.queryPost(this.authRoute, body, true);
  }

  updateDataUser(body: object) {
    let token = localStorage.getItem("gtoken");
    return this.provider.queryJson("/confa/metodo22", body, 1, token);
  }

  updateDataUserHealth(data: object) {
    return this.rest.queryPost("citasWeb/metodo11", data, true);
  }

  getUserHealth(data: object) {
    this._getUserHealth.emit(data);
  }

  getDataUserHealth(data: object) {
    return this.rest.queryPost("citasWeb/metodo6", data, true);
  }
  guardarSuperUsuario(data: object) {
    return this.rest.queryPost("citasWeb/metodo22", data, true);
  }
  getdatos(data: object) {
    return this.rest.queryPost("citasWeb/metodo21", data, true);
  }
}
