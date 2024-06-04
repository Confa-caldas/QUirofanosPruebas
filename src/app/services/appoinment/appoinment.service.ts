import { Injectable } from '@angular/core';
import { ApiRestService } from '../api-rest.service';

@Injectable({
  providedIn: 'root'
})
export class AppoinmentService {

  constructor(
    private rest: ApiRestService
  ) { }

  getAppoinments(data){
    return this.rest.queryPost('citasWeb/metodo8', data, true);
  }

  getAppoinmentsTypes(data){
    return this.rest.queryPost('citasWeb/metodo2', data, true);
  }

  gethealthcareProfessionals(data){
    return this.rest.queryPost('citasWeb/metodo3', data, true);
  }

  getAvaliableAppoinments(data){
    return this.rest.queryPost('citasWeb/metodo5', data, true);
  }

  getAvaliableAppoinmentsByHealthProfessional(data){
    return this.rest.queryPost('citasWeb/metodo4', data, true);
  }

  getAppoinmentVaues(data){
    return this.rest.queryPost('citasWeb/metodo7', data, true);
  }

  saveAppointment(data){
    return this.rest.queryPost('citasWeb/metodo9', data, true);
  }

  cancelAppointment(data){
    return this.rest.queryPost('citasWeb/metodo10', data, true);
  }

  getHistoricAppointment(data){
    return this.rest.queryPost('citasWeb/metodo13', data, true);
  }

  getAppointmebtById(data){
    return this.rest.queryPost('citasWeb/metodo14', data, true);
  }
}
