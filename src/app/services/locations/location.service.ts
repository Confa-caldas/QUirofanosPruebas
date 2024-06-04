import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  public data = [
    { id: "VER__", name: "Centro Médico Confa de la 50" },
    { id: "ENE__", name: "Centro Médico Confa San Marcel" },
    { id: "CCFUN", name: "Centro Comercial Fundadores Parqueadero -3" },
  ];

  constructor() {}

  getAll() {
    return this.data;
  }

  filterLocation(value) {
    if (!value) {
      return value;
    }
    for (let i = 0; i < this.data.length; i++) {
      if (value == this.data[i].id) {
        return this.data[i].name;
      }
    }
  }
}
