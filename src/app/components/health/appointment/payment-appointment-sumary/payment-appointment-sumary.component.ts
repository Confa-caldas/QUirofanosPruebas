import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PaymentsService} from './../../../../services/payments/payments.service';
import {UtilitiesService} from 'src/app/services/general/utilities.service';
import {AppoinmentService} from 'src/app/services/appoinment/appoinment.service';
import * as moment from 'moment';
@Component({
  selector: 'app-payment-appointment-sumary',
  templateUrl: './payment-appointment-sumary.component.html',
  styleUrls: ['./payment-appointment-sumary.component.scss'],
})
export class PaymentAppointmentSumaryComponent implements OnInit {
  public main_health = '/salud/citas/';
  public main_appointments = '/salud/citas/';
  public idAppointment = '';
  public appointmentData = {
    value: '',
    currency: '',
    bankname: '',
    TrazabilityCode: '',
    date_hour: '',
    name: '',
    document: '',
    address: '',
    cellphone: '',
    email: '',
    status: '',
    ticketId: '',
  };

  private appointmentPrivateData = {
    tipoCita: '',
    codMedico: '',
    fechaCita: '',
    horaCitaBD: '',
    noPaciente: '',
    valor: '',
  };
  public code = '';
  public onlyShow = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private paymentService: PaymentsService,
    private appoimentService: AppoinmentService,
    private ut: UtilitiesService,
  ) {}

  ngOnInit() {
    this.idAppointment = this.route.snapshot.queryParams['e541f24f'];
    this.onlyShow = this.route.snapshot.queryParams['show'];
    setTimeout(() => {
      console.log(moment().format('H:m:s'));
      this.ut.toggleSplashscreen(true);
      if (this.idAppointment) {
        this.getAppointmentData();
        this.findData();
      } else {
        // this.router.navigate([this.main_health]);
      }
    }, 800);
  }

  getAppointmentData() {
    //this.ut.toggleSplashscreen(true);
    let data = {
      consecutivo: this.idAppointment,
    };
    this.appoimentService.getAppointmebtById(data).subscribe(
      (success) => {
        let result = success.json();

        this.appointmentPrivateData = {
          tipoCita: result.citaAsignada.tipoCita,
          codMedico: result.citaAsignada.codMedico,
          fechaCita: result.citaAsignada.fechaCita,
          horaCitaBD: result.citaAsignada.horaCitaBD,
          noPaciente: result.citaAsignada.noPaciente,
          valor: result.citaAsignada.valor,
        };
      },
      (err) => {
        console.log(err);
        this.ut.toggleSplashscreen(false);
      },
    );
  }

  findData() {
    console.log(moment().format('H:m:s'));
    let data = {
      area: '2',
      servicio: '2',
      subServicio: '2',
      productoId: this.idAppointment + '',
    };

    this.paymentService.findRegisterPayment(data).subscribe(
      (response:any) => {
        let result = response.json();

        if (result.respuesta.estado == 'OK') {
          this.appointmentData['value'] = result.registroPago.valorTotal;
          this.appointmentData['document'] = result.registroPago.identificacion;
          this.findRegister(result);
        } else {
          this.ut.toggleSplashscreen(false);
        }
      },
      (err) => {
        //console.log(err);
        this.ut.toggleSplashscreen(false);
      },
    );
  }

  findRegister(response) {
    let data = {
      GetTransactionInformation: {
        entityCode: '10577',
        ticketId: response.registroPago.ticketId, //Update with data
      },
    };

    this.paymentService.queryPaymentEcollect(data).subscribe(
      (response:any) => {
        let result = response.json();

        this.appointmentData.value = result.transValue;
        this.appointmentData.currency = result.payCurrency;
        this.appointmentData.bankname = result.bankName;
        this.appointmentData.TrazabilityCode = result.trazabilityCode;
        this.appointmentData.date_hour = moment(result.bankProcessDate).format(
          'MMMM DD YYYY, h:mm:ss a',
        );
        this.appointmentData.name = decodeURIComponent(result.nombreApellido);
        this.appointmentData.document = result.numeroIdentificacion;
        this.appointmentData.address = result.direccionResidencia;
        this.appointmentData.cellphone = result.celular ? result.celular : '';
        this.appointmentData.email = result.emailConfirmacion;
        this.appointmentData['ticketId'] = result.ticketId;

        switch (result.tranState) {
          case 'OK':
            this.code = 'Transacción aprobada por la entidad financiera';
            this.updateStatus(result.tranState, result.ticketId);
            //this.createBill();
            break;

          case 'NOT_AUTHORIZED':
            this.code = 'Transacción no aprobada por la entidad financiera';

            this.updateStatus(result.tranState, result.ticketId);
            break;

          case 'EXPIRED':
            this.code = 'Transacción expirada';

            this.updateStatus(result.tranState, result.ticketId);
            break;

          case 'FAILED':
            this.code =
              'Se ha presentado un fallo en la comunicación con la entidad financiera';

            this.updateStatus(result.tranState, result.ticketId);
            break;

          case 'PENDING':
            this.code = 'La transacción está pendiente de aprobación';

            this.updateStatus(result.tranState, result.ticketId);
            break;

          case 'BANK':
            this.code =
              'Se ha presentado un fallo en la comunicación con la entidad financiera';

            this.updateStatus(result.tranState, result.ticketId);
            break;
        }
      },
      (err) => {
        //console.log(err);
        this.ut.toggleSplashscreen(false);
      },
    );
  }

  updateStatus(transState, ticket) {
    if (this.onlyShow) {
      this.ut.toggleSplashscreen(false);
      return;
    }

    let code = 0;
    switch (transState) {
      case 'SUCCESS':
        code = 1;
        break;

      case 'OK':
        code = 2;
        break;

      case 'NOT_AUTHORIZED':
        code = 3;
        break;

      case 'EXPIRED':
        code = 4;
        break;

      case 'FAILED':
        code = 5;
        break;

      case 'PENDING':
        code = 6;
        break;

      case 'BANK':
        code = 7;
        break;
    }

    let data = {
      ticketId: ticket,
      estadoTransaccionId: code + '',
    };
    this.paymentService.updateStatusTransaction(data).subscribe(
      (response:any) => {
        let result = response.json();

        if (result.estado == 'OK' && transState == 'OK') {
          //We go to create a bill
          this.createBill();
        } else {
          this.ut.toggleSplashscreen(false);
        }
      },
      (err) => {
        //console.log(err);
        this.ut.toggleSplashscreen(false);
      },
    );
  }

  createBill() {
    if (this.onlyShow) {
      this.ut.toggleSplashscreen(false);
      return;
    }
    let data = {
      tipoCita: this.appointmentPrivateData['tipoCita'],
      codMedico: this.appointmentPrivateData['codMedico'],
      fechaCita: moment(this.appointmentPrivateData['fechaCita']).format(
        'YYYY-MM-DD',
      ),
      horaCitaBD: this.appointmentPrivateData['horaCitaBD'],
      noPaciente: this.appointmentPrivateData['noPaciente'],
      valorCita: this.appointmentPrivateData['valor'],
    };

    this.paymentService.createBill(data).subscribe(
      (response) => {
        this.ut.toggleSplashscreen(false);
        let result = response.json();

        if (result.estado == 'ERROR_SISTEMA') {
          this.showErrorMessges(result.mensaje);
        }
      },
      (err) => {
        //console.log(err);
        this.ut.toggleSplashscreen(false);
      },
    );
  }

  goToList() {
    this.router.navigate(['salud/citas']);
  }

  showErrorMessges(message) {
    this.ut.showErrorsModal(true, message);
  }
}
