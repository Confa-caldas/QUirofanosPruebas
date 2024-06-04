import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import {
  PageScrollConfig,
  PageScrollService,
  PageScrollInstance,
} from "ngx-page-scroll-core";
import * as globals from "../../../../globals";
import { AppoinmentService } from "src/app/services/appoinment/appoinment.service";
import { UtilitiesService } from "src/app/services/general/utilities.service";
import { ToastrService } from "ngx-toastr";
import { UserService } from "src/app/services/user/user.service";
import { PaymentsService } from "./../../../../services/payments/payments.service";
import { SingletonService } from "src/app/singleton.service";
import * as moment from "moment";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
declare var $: any;

@Component({
  selector: "app-appointment",
  templateUrl: "./appointment.component.html",
  styleUrls: ["./appointment.component.scss"],
})
export class AppointmentComponent implements OnInit, OnDestroy {
  private unsubscribes: Subscription[] = [];

  public appointmentToDelete = null;
  public appointmenttoPay = null;
  private redirectPath = "https://app.confa.co:8321";

  public scheduleAppointmentLink = "/quirofanos/citas/agendarCita";
  public bgimage = globals.bannerAppoiments;
  public scheduleAppoiments = globals.scheduleAppoiments;
  public citaSeresQueridos = globals.citaSeresQueridos;
  public historialCitasBlank = globals.historialCitasBlank;
  public form: string;
  public appoinmentsList = [];
  public userData = {
    direccion: "",
    telefono: "",
    telCelular: "",
    email: "",
  };

  constructor(
    private pageScrollService: PageScrollService,
    private appoimentService: AppoinmentService,
    private ut: UtilitiesService,
    private toastr: ToastrService,
    private paymentService: PaymentsService,
    private userService: UserService,
    private singleton: SingletonService,
    private cd: ChangeDetectorRef,
    private router: Router,
    @Inject(DOCUMENT) private doc: any
  ) {}

  ngOnInit() {
    if (this.ut.showModalInfo == true) {
      this.ut.messageTitleModal = "Recuerda";
      this.ut.messageModal =
        "Aquí podrás radicar cirugías de tu entidad aseguradora. Si deseas radicar cirugías de SOAT, debes acercarte directamente a la oficina de admisiones de cirugía que se encuentra ubicada en la Clínica San Marcel en el segundo piso en el horario de lunes a viernes de 7:00 am a 5:00 pm, jornada continua.";
      $(".btn-modal-warning").click();
    }
    if (localStorage.getItem("form")) {
      localStorage.removeItem("form");
      this.form = "1";
      localStorage.setItem("form", this.form);
    } else {
      this.form = "1";
      localStorage.setItem("form", this.form);
    }
    this.ut.getshowHideAppointmenUser(true);
    this.getAppoimentsList();
    this.findUserData();

    this.cd.detectChanges();

    // Function to cancel and pay appointment
    let responseCancel = this.ut._responseModalConfirm.subscribe((res) => {
      if (res) {
        if (this.appointmentToDelete) {
          this.cancelAppoinment();
        }

        if (this.appointmenttoPay) {
          this.validateExistTransaction(this.appointmenttoPay);
        }
      } else {
        this.appointmentToDelete = null;
      }
    });
    this.unsubscribes.push(responseCancel);
  }

  ngOnDestroy() {
    this.unsubscribes.forEach((sb) => sb.unsubscribe());
  }

  scrollTo(_destination: string) {
    const pageScrollInstance: PageScrollInstance = this.pageScrollService.create({
      document: this.doc,
      scrollTarget: _destination,
    });
    this.pageScrollService.start(pageScrollInstance);
  }

  getAppoimentsList() {
    let document = this.ut.getLocalSession().documento;
    let aditional = this.ut.getLocalSession().adicional;
    if (document) {
      let data = {
        documento: document,
        adicional: aditional,
      };

      this.appoimentService.getAppoinments(data).subscribe(
        (success: any) => {
          let result = success;

          this.appoinmentsList = [];
          this.appoinmentsList = result.citasUsuario;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  confirmCancelAppoinment(appoinmentData) {
    this.appointmenttoPay = null;
    let title = globals.confirmCancelAppointmentTitle;
    let message = globals.confirmCancelAppointmentMessage;
    this.appointmentToDelete = appoinmentData;
    this.ut.showConfirmModal(true, title, message, "");
  }

  cancelAppoinment() {
    this.ut.toggleSplashscreen(true);
    let data = {
      codMedico: this.appointmentToDelete["codMedico"],
      fechaCita: moment(this.appointmentToDelete["fechaCita"]).format(
        "YYYY-MM-DD"
      ),
      horaCitaBD: this.appointmentToDelete["horaCitaBD"],
      noPaciente: this.appointmentToDelete["noPaciente"],
      // consecutivo: this.appointmentToDelete['consecutivo']
    };

    this.appointmentToDelete = null;
    this.appoimentService.cancelAppointment(data).subscribe(
      (success: any) => {
        let result = success;
        this.ut.toggleSplashscreen(false);
        if (result.estado === "OK") {
          let message = result.mensaje;
          this.showSuccessMessage(message);
        } else {
          this.showErrorsMessages(result.mensaje);
        }

        this.getAppoimentsList();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  showErrorsMessages(message) {
    this.ut.showErrorsModal(true, message);
  }

  confirmPayAppoinment(appoinmentData) {
    // this.ut.toggleSplashscreen(true);
    this.appointmentToDelete = null;
    let title = globals.redirectTitleEcollect;
    let message = globals.redirectMessageEcollect;
    this.appointmenttoPay = appoinmentData;
    this.ut.showConfirmModal(true, title, message, "");
  }

  findUserData() {
    let dataSession = this.ut.getLocalSession();
    let data = {
      documento: dataSession["documento"],
      adicional: dataSession["adicional"],
    };

    this.userService.getDataUserHealth(data).subscribe(
      (success: any) => {
        let response = success;

        if (response.contactoUsuario) {
          this.userData = {
            direccion: response.contactoUsuario["direccion"],
            telefono: response.contactoUsuario["telefono"],
            telCelular: response.contactoUsuario["telCelular"],
            email: response.contactoUsuario["email"],
          };
          localStorage.setItem("userInfo", JSON.stringify(this.userData));
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  validateExistTransaction(appoinmentData) {
    this.ut.toggleSplashscreen(true);
    let body = {
      area: "2",
      servicio: "2",
      subServicio: "2",
      productoId: appoinmentData["consecutivo"],
    };

    this.paymentService.findRegisterPayment(body).subscribe(
      (response: any) => {
        let result = response;

        let transState = result.registroPago.estadoTransaccion.estadoTransaccionId;

        if (
          transState != 1 &&
          transState != 2 &&
          transState != 6 &&
          transState != 7
        ) {
          this.payAppoinment(this.appointmenttoPay);
        } else {
          this.ut.toggleSplashscreen(false);
          let message =
            "Existe una transacción en curso con la entidad financiera";
          this.showErrorsMessages(message);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  payAppoinment(appoinmentData) {
    let dataSession = this.ut.getLocalSession();

    let url =
      this.redirectPath +
      "/salud/citas/resumen-pago?e541f24f=" +
      appoinmentData["consecutivo"];

    let data = {
      CreateTransactionPayment: {
        entityCode: "10577",
        srvCode: "10001",
        transValue: appoinmentData["valor"],
        urlRedirect: url,
        numeroIdentificacion: dataSession["documento"],
        identificadorProducto: appoinmentData["consecutivo"],
        nombreApellido: dataSession["user"],
        tipoDocumento: dataSession["tipoDocumento"],
        direccionResidencia: this.userData["direccion"],
        celular: this.userData["telCelular"],
        emailConfirmacion: this.userData["email"],
        codigoArea: "2",
        codigoServicio: "2",
        codigoSubservicio: "2",
        invoice: "",
      },
    };

    this.paymentService.paymentData(data).subscribe(
      (response: any) => {
        let result = response;

        this.validateResponse(result, appoinmentData);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  validateResponse(data, appointmentData) {
    let code = data["returnCode"];
    let ticket = data["ticketId"];
    let url = data["eCollectUrl"];
    let total = appointmentData["valor"];

    let validate = true;

    switch (code) {
      case "SUCCESS":
        validate = true;
        code = 1;
        break;

      case "OK":
        validate = true;
        code = 2;
        break;

      case "NOT_AUTHORIZED":
        validate = false;
        code = 3;
        break;

      case "EXPIRED":
        validate = true;
        code = 4;
        break;

      case "FAILED":
        validate = false;
        code = 5;
        break;

      case "PENDING":
        validate = true;
        code = 6;
        break;

      case "BANK":
        validate = true;
        code = 7;
        break;
    }

    if (validate) {
      let dataSession = this.ut.getLocalSession();
      let body = {
        area: "2",
        servicio: "2",
        subServicio: "2",
        productoId: appointmentData["consecutivo"] + "",
        identificacion: dataSession["documento"] + "",
        bonoPactoColectivo: false,
        valorTotal: total + "",
        valorPago: appointmentData["valor"] + "",
        valorBono: "0",
        ticketId: ticket + "",
        estadoTransaccion: code + "",
        urlPago: url + "",
      };

      this.paymentService.createRegisterConfa(body).subscribe(
        (response: any) => {
          let result = response;

          if (result.estado == "OK") {
            window.open(url, "_parent");
          } else {
            this.ut.toggleSplashscreen(false);
            this.showErrorsMessages(result.mensaje);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.ut.toggleSplashscreen(false);
    }
  }

  ViewDetails(id) {
    this.router.navigate(["/salud/citas/resumen-pago"], {
      queryParams: { e541f24f: "" + id, show: "true" },
    });
  }

  showSuccessMessage(message) {
    this.toastr.success(message, "Buen trabajo", {
      enableHtml: true,
      positionClass: "toast-middle-right",
      timeOut: 5000,
    });
  }
}
