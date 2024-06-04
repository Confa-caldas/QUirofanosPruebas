import { Injectable } from '@angular/core';
import { RestProvider } from '../../providers/rest/rest';
import { UtilitiesService } from '../general/utilities.service';
import { ApiRestService } from '../api-rest.service';
@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private token = "";

  constructor(
    private provider: RestProvider,
    private ut: UtilitiesService,
    private rest: ApiRestService
  ) {
    this.token = "Bearer " + this.ut.getTokenSession();
  }

  createRegisterConfa(data) {

    return this.provider.queryPasarela('/metodo1', data, this.token);
  }

  findRegisterPayment(data) {
    return this.provider.queryPasarela('/metodo2', data, this.token);
  }

  updateStatusTransaction(data) {
    return this.provider.queryPasarela('/metodo3', data, this.token);
  }

  paymentData(data) {

    return this.provider.queryPasarela('/metodo5', data, this.token);
  }

  queryPaymentEcollect(data) {
    return this.provider.queryPasarela('/metodo6', data, this.token);
  }

  createBill(data) {
    return this.rest.queryPost('citasWeb/metodo12', data, true);
  }




}
