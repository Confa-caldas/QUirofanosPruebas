import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  TemplateRef,
  Input,
  OnChanges,
  ChangeDetectorRef,
  Inject,
  ViewChild,
} from "@angular/core";
import {
  Router,
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ActivatedRoute,
  NavigationEnd,
} from "@angular/router";
import { CalendarEvent, CalendarMonthViewDay } from "angular-calendar";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import * as globals from "../../../../../globals";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from "date-fns";
import { AppoinmentService } from "src/app/services/appoinment/appoinment.service";
import { UtilitiesService } from "src/app/services/general/utilities.service";
import * as moment from "moment";
import { Subject, Subscription } from "rxjs";
import { LocationService } from "./../../../../../services/locations/location.service";
import { UserService } from "src/app/services/user/user.service";
import { ToastrService } from "ngx-toastr";
import { PaymentsService } from "./../../../../../services/payments/payments.service";
import { SingletonService } from "src/app/singleton.service";
import {
  PageScrollConfig,
  PageScrollService,
  PageScrollInstance,
} from "ngx-page-scroll-core";
import { DOCUMENT } from "@angular/common";
import { CalendarDateFormatter } from "angular-calendar";
import { CustomDateFormatter } from "./custom-date-formatter.provider";
import * as _globals from "src/environments/environment";
@Component({
  selector: "app-calendar-widget",
  templateUrl: "./calendar-widget.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./calendar-widget.component.scss"],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class CalendarWidgetComponent implements OnInit {
  public emailFieldAppointment = globals.emailFieldAppointment;
  public confirmEmailFieldAppointment = globals.confirmEmailFieldAppointment;
  public phoneNumberFieldAppointment = globals.phoneNumberFieldAppointment;
  public cellphoneNumberFieldAppointment =
    globals.cellphoneNumberFieldAppointment;
  public addressFieldAppointment = globals.addressFieldAppointment;

  private redirectPath = _globals._site.url;

  public bgimage = globals.bannerConfirmAppoinment;
  public formasPago = globals.formasPago;

  view: string = "month";
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  clickedDate: Date;
  clickedColumn: number;

  activeDayIsOpen: boolean = true;

  public aFormGroup: UntypedFormGroup;

  @Input() scheduleAppoinment = {
    id: 0,
    documento: "",
    adicional: "",
    convenio: "",
    codPlan: "",
    tipoCita: null,
    prefijo: "",
    codServicio: null,
    lugarCita: "",
    codMedico: null,
    fechaCita: "",
    horaCitaBD: "",
    noPaciente: "",
    email: "",
  };

  @Input() healthcareProfessional: any;

  public healthcareProfessionalAux = [];

  /**
   * Classes
   * */
  _mainClass = "col-xl-12 col-lg-12 col-md-12 col-sm-12";
  _mainClassToggle = "col-xl-7 col-lg-7 col-md-12 col-sm-12";

  _mainClassSecond = "col-xl-6 col-lg-6 col-md-12 col-sm-12";
  _mainClassSecondToggle = "col-xl-5 col-lg-5 col-md-12 col-sm-12 cf-visible";

  private unsubscribes: Subscription[] = [];

  /**
   * Vars for modal
   */
  modalRef: BsModalRef;

  refresh: Subject<any> = new Subject();
  public availableAppoinments = [];

  public appoinmentsDay = [];
  public appoinmentsDayShow = [];
  public codMedico = null;

  @ViewChild("modalScheduleAppoiment", { static: false }) modalScheduleAppoiment;
  public userDataToUpdate = {
    email: "",
    phone: null,
    cellphone: null,
    confirmEmail: "",
    address: "",
    newUser: true,
  };

  public showButtonsPayment: boolean = false;
  public scheduleId = "";

  public disabledSelector: boolean = false;
  public scrollToDiv = false;
  public mediaQuery = "";

  public MESSAGE_ALERT: string =
    "No contamos con citas disponibles para este mes. Busca en el siguiente mes";
  public showAlertMessage: boolean = false;
  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private appoimentService: AppoinmentService,
    private ut: UtilitiesService,
    private cd: ChangeDetectorRef,
    private locationService: LocationService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private paymentService: PaymentsService,
    private singleton: SingletonService,
    private pageScrollService: PageScrollService,
    @Inject(DOCUMENT) private doc: any
  ) {}

  ngOnInit() {
    this.getMediaQuery();
    this.createForm();
    this.cd.detectChanges();

    if (this.scheduleAppoinment["codMedico"]) {
      if (this.scheduleAppoinment["codMedico"]["codMedico"] == "0cfs") {
        this.scheduleAppoinment["codMedico"] = null;
        this.getAvailableAppoinments();
      } else {
        this.disabledSelector = true;
        this.healthcareProfessionalAux.push(
          this.scheduleAppoinment["codMedico"]
        );
        this.codMedico = this.scheduleAppoinment["codMedico"]["codMedico"];
        this.getAvaliableAppoinmentsByHealthProfessional();

        this.onSelectCodMed(this.scheduleAppoinment["codMedico"]);
      }
    } else {
      this.getAvailableAppoinments();
    }

    const response = this.ut._responseModalConfirm.subscribe((res) => {
      if (res) {
        this.payAppoinment();
      } else {
        //this.closeModal();
        // this.router.navigate(['salud/citas']);
      }
    });
    this.unsubscribes.push(response);
  }

  ngOnDestroy() {
    this.unsubscribes.forEach((sb) => sb.unsubscribe());
  }

  getMediaQuery() {
    let width = screen.width;

    if (width <= 991.98) {
      this.scrollToDiv = true;
    }
  }

  
  scrollTo(_destination: string) {
    const pageScrollInstance: PageScrollInstance = this.pageScrollService.create({
      document: this.doc,
      scrollTarget: _destination,
    });
    this.pageScrollService.start(pageScrollInstance);
  }


  createForm() {
    this.aFormGroup = this.formBuilder.group({
      convenio: [
        this.scheduleAppoinment["convenio"],
        Validators.compose([
          Validators.required,
          //Validators.minLength(6)
        ]),
      ],
      tipoCita: [
        this.scheduleAppoinment["tipoCita"],
        Validators.compose([Validators.required]),
      ],
      codServicio: [
        this.scheduleAppoinment["codServicio"],
        Validators.compose([Validators.required]),
      ],
      codMedico: [
        this.scheduleAppoinment["codMedico"],
        Validators.compose([Validators.required]),
      ],
      userEmail: [
        this.userDataToUpdate["email"],
        Validators.compose([Validators.required, Validators.maxLength(40)]),
      ],
      userConfirm: [
        this.userDataToUpdate["confirmEmail"],
        Validators.compose([Validators.required, Validators.maxLength(40)]),
      ],
      userPhone: [
        this.userDataToUpdate["phone"],
        Validators.compose([
          // Validators.required,
          Validators.maxLength(20),
        ]),
      ],
      userCellPhone: [
        this.userDataToUpdate["cellphone"],
        Validators.compose([Validators.required, Validators.maxLength(10)]),
      ],
      userAddress: [
        this.userDataToUpdate["address"],
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
    });
  }

  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.aFormGroup.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.appoinmentsDayShow = [];
    if (!this.disabledSelector) {
      this.aFormGroup.controls["codMedico"].patchValue(null);
    }

    let showAlert = true;
    this.appoinmentsDay = [];
    let tempDate = moment(date).format("YYYY-MM-DD");

    this.healthcareProfessionalAux = [];
    for (let i = 0; i < this.availableAppoinments.length; i++) {
      if (
        moment(this.availableAppoinments[i].start).format("YYYY-MM-DD") ==
        tempDate
      ) {
        showAlert = false;
        this.appoinmentsDay.push(this.availableAppoinments[i]);
        this.addHealthCareProfessionals(this.availableAppoinments[i]);
      }
    }

    if (showAlert) {
      this._mainClass = "col-xl-12 col-lg-12 col-md-12 col-sm-12";
      this._mainClassSecond = "col-xl-6 col-lg-6 col-md-12 col-sm-12";

      let message =
        "No tenemos citas disponibles para la fecha seleccionada, prueba seleccionando otra";
      this.showErrorsMessages(message);
      return;
    }

    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
    this.clickedDate = date;
    this._mainClass = this._mainClassToggle;
    this._mainClassSecond = this._mainClassSecondToggle;

    if (this.disabledSelector) {
      this.onSelectCodMed(this.scheduleAppoinment["codMedico"]);
    }

    if (this.scrollToDiv) {
      this.scrollTo("#AppointmentLists");
    }
  }

  addHealthCareProfessionals(data) {
    if (data != null) {
      if (this.healthcareProfessionalAux.length == 0) {
        this.healthcareProfessionalAux.push({
          codMedico: data["codMedico"],
          nombre: data["nomMedico"],
        });
      } else {
        let validateInsert = true;
        for (let i = 0; i < this.healthcareProfessionalAux.length; i++) {
          if (this.healthcareProfessionalAux[i].codMedico == data.codMedico) {
            validateInsert = false;
            break;
          }
        }

        if (validateInsert) {
          this.healthcareProfessionalAux.push({
            codMedico: data["codMedico"],
            nombre: data["nomMedico"],
          });
        }
      }
    }
    return;
  }

  validateUserDataToUpdate(template: TemplateRef<any>, data) {
    let userSession = this.userService.getSessionUser();

    this.searchDataUser(template);
    /* if(!userSession){
            this.searchDataUser(template);
        }else{
            if(!userSession['correo'] || userSession['correo'] == '' || !userSession['celular'] || userSession['celular'] == '' || !userSession['telefono'] || userSession['telefono'] == '' || !userSession['direccion'] || userSession['direccion'] == ''){
                this.searchDataUser(template);
            }else{
                this.userDataToUpdate = {
                    email: userSession['correo'],
                    phone: userSession['telefono'],
                    cellphone: userSession['celular'],
                    address: userSession['direccion'],
                    confirmEmail: userSession['correo'],
                    newUser: true
                }
                if(this.userDataToUpdate.email){
                    this.aFormGroup.controls['userEmail'].patchValue(this.userDataToUpdate['email'], { onlySelf: true });
                   
                    this.userDataToUpdate.newUser = false;
                }else{
                    this.userDataToUpdate.newUser = true;
                }
                this.openModal(template);
            }
        } */
  }

  openModal(template: TemplateRef<any>) {
    let userSession = this.ut.geLocalSessionData("user");

    this.ut.toggleSplashscreen(false);
    if (!userSession) {
      this.userDataToUpdate.newUser = true;
      this.aFormGroup.controls["userConfirm"].patchValue("");
    } else {
      this.userDataToUpdate.email = userSession["correo"];
      this.userDataToUpdate.address = userSession["direccion"];
      this.userDataToUpdate.cellphone = userSession["celular"];
      this.userDataToUpdate.phone = userSession["telefono"];

      this.aFormGroup.controls["userEmail"].disable();
      this.userDataToUpdate.newUser = false;
    }

    this.modalRef = this.modalService.show(
      template,
      Object.assign({ backdrop: true }, { class: "gray modal-lg cf-modal" })
    );
    this.aFormGroup.updateValueAndValidity();
    this.cd.detectChanges();
  }

  getAppointmentsValue(template: TemplateRef<any>, prevData) {
    this.ut.toggleSplashscreen(true);
    this.scheduleAppoinment["fechaCita"] = prevData["fechaCita"];
    this.scheduleAppoinment["horaCita"] = prevData["horaCita"];
    this.scheduleAppoinment["horaCitaBD"] = prevData["horaCitaBD"];
    //this.scheduleAppoinment['codMedico'] = prevData['codMedico'];
    this.scheduleAppoinment["nomMedico"] = prevData["nomMedico"];
    this.scheduleAppoinment["lugarCita"] = prevData["lugarCita"];

    let dataSession = this.ut.getLocalSession();

    let data = {
      documento: dataSession["documento"],
      adicional: dataSession["adicional"],
      convenio: this.scheduleAppoinment["convenio"],
      codPlan: this.scheduleAppoinment["codPlan"],
      tipoCita: this.scheduleAppoinment["tipoCita"]["tipoCita"],
      prefijo: this.scheduleAppoinment["tipoCita"]["prefijo"],
      codServicio: this.scheduleAppoinment["tipoCita"]["codigo"],
      lugarCita: this.scheduleAppoinment["lugarCita"],
      codMedico: prevData["codMedico"] ? prevData["codMedico"] : this.codMedico,
      fechaCita: prevData["fechaCita"],
      horaCitaBD: prevData["horaCitaBD"],
      noPaciente: prevData["NoPaciente"],
    };
    this.scheduleAppoinment["noPaciente"] = prevData["NoPaciente"];
    this.scheduleAppoinment[
      "lugarCitaName"
    ] = this.locationService.filterLocation(
      this.scheduleAppoinment["lugarCita"]
    );

    this.appoimentService.getAppoinmentVaues(data).subscribe(
      (success) => {
        let result = success.json();

        if (result.respuesta) {
          if (result.respuesta.estado == "OK") {
            this.scheduleAppoinment["value"] = result.valorCita;
            this.validateUserDataToUpdate(template, prevData);
          } else {
            this.ut.toggleSplashscreen(false);
            let message = result.respuesta.mensaje;
            this.showErrorsMessages(message);
          }
        } else {
          this.ut.toggleSplashscreen(false);
          let message = result.mensaje;
          this.showErrorsMessages(message);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAvailableAppoinments() {
    this.ut.toggleSplashscreen(true);
    let data = {
      citaId: this.scheduleAppoinment["tipoCita"]["citaId"],
    };
    this.appoimentService.getAvaliableAppoinments(data).subscribe(
      (success) => {
        let response = success.json();
        if (response.respuesta) {
          if (response.respuesta.estado == "OK") {
            this.addEventsToArray(response);
          } else {
            let message = response.respuesta.mensaje;
            this.showErrorsMessages(message);
          }
        } else {
          let message = response.mensaje;
          this.showErrorsMessages(message);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAvaliableAppoinmentsByHealthProfessional() {
    this.ut.toggleSplashscreen(true);
    let data = {
      citaId: this.scheduleAppoinment["tipoCita"]["citaId"],
      codMedico: this.codMedico,
    };

    this.appoimentService
      .getAvaliableAppoinmentsByHealthProfessional(data)
      .subscribe(
        (success) => {
          let response = success.json();

          if (response.respuesta) {
            if (response.respuesta.estado == "OK") {
              this.addEventsToArray(response);
            } else {
              let message = response.respuesta.mensaje;
              this.showErrorsMessages(message);
            }
          } else {
            let message = response.mensaje;
            this.showErrorsMessages(message);
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  addEventsToArray(data) {
    let length = data.citasDisponibles.length;
    let nomMedico = "";
    let codMedico = "";
    if (this.codMedico) {
      nomMedico = this.scheduleAppoinment["codMedico"]["nombre"];
      codMedico = this.scheduleAppoinment["codMedico"]["codMedico"];
    }
    for (let i = 0; i < length; i++) {
      let temp = {
        title: "",
        nomMedico: data.citasDisponibles[i].nomMedico
          ? data.citasDisponibles[i].nomMedico
          : nomMedico,
        codMedico: data.citasDisponibles[i].codMedico
          ? data.citasDisponibles[i].codMedico
          : codMedico,
        fechaCita: data.citasDisponibles[i].fechaCita,
        horaCita: data.citasDisponibles[i].horaCita,
        horaCitaBD: data.citasDisponibles[i].horaCitaBD,
        lugarCita: data.citasDisponibles[i].lugarCita,
        NoPaciente: data.citasDisponibles[i].NoPaciente,
        citaIdDisAsig: data.citasDisponibles[i].nomMedico
          ? data.citasDisponibles[i].nomMedico
          : nomMedico,
        start: addHours(startOfDay(data.citasDisponibles[i].fechaCita), 2),
        end: addHours(startOfDay(data.citasDisponibles[i].fechaCita), 2),
        color: {
          primary: "#ccc",
          secondary: "#ccc",
        },
        draggable: false,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      };
      this.ut.toggleSplashscreen(false);
      this.availableAppoinments.push(temp);
      this.events.push(temp);
    }
    let viewDate = moment(this.viewDate).format("YYYY-MM-DD");
    /*  if(viewDate){
             this.showAlertMessage = true;
         } */

    document.getElementById("click-calendar").click();
    this.refreshView();
  }

  onSelectCodMed(event) {
    if (event) {
      this.appoinmentsDayShow = this.appoinmentsDay.filter(
        (appointment) => appointment.codMedico == event.codMedico
      );
    } else {
      this.appoinmentsDayShow = [];
    }
  }

  updateUserData() {
    this.ut.toggleSplashscreen(true);
    if (this.userDataToUpdate["newUser"]) {
      if (
        this.userDataToUpdate["email"] != this.userDataToUpdate["confirmEmail"]
      ) {
        let message = globals.confirmEmail;
        this.showErrorsMessages(message);
        this.ut.toggleSplashscreen(false);
        return;
      }
    } else {
      this.userDataToUpdate["confirmEmail"] = this.userDataToUpdate["email"];
    }

    if (this.userDataToUpdate["email"].length > 40) {
      let message = globals.emailLength;
      this.ut.toggleSplashscreen(false);
      this.showErrorsMessages(message);
      return;
    }

    if (
      !this.userDataToUpdate["email"] ||
      !this.userDataToUpdate["cellphone"] ||
      !this.userDataToUpdate["address"]
    ) {
      let message = globals.confirmAllFields;
      this.ut.toggleSplashscreen(false);
      this.showErrorsMessages(message);
      return;
    }

    if (
      this.userDataToUpdate["email"] == "" ||
      this.userDataToUpdate["cellphone"] == "" ||
      this.userDataToUpdate["address"] == ""
    ) {
      let message = globals.confirmAllFields;
      this.ut.toggleSplashscreen(false);
      this.showErrorsMessages(message);
      return;
    }

    if (
      !this.ut.validateEmail(this.userDataToUpdate["email"]) ||
      !this.ut.validateEmail(this.userDataToUpdate["confirmEmail"])
    ) {
      let message = globals.invalidEmail;
      this.ut.toggleSplashscreen(false);
      this.showErrorsMessages(message);
      return;
    }

    if (
      this.ut.validateNumber(this.userDataToUpdate["phone"]) &&
      this.userDataToUpdate["phone"].length < 7
    ) {
      let message = globals.invalidPhoneNumber;
      this.ut.toggleSplashscreen(false);
      this.showErrorsMessages(message);
      return;
    }

    if (
      !this.ut.validateNumber(this.userDataToUpdate["cellphone"]) ||
      this.userDataToUpdate["cellphone"].length < 7
    ) {
      let message = globals.invalidCellPhoneNumber;
      this.ut.toggleSplashscreen(false);
      this.showErrorsMessages(message);
      return;
    }

    if (this.userDataToUpdate["phone"].length >= 20) {
      let message = globals.phoneLength;
      this.ut.toggleSplashscreen(false);
      this.showErrorsMessages(message);
      return;
    }

    if (this.userDataToUpdate["cellphone"].length > 10) {
      let message = globals.cellPhoneLength;
      this.ut.toggleSplashscreen(false);
      this.showErrorsMessages(message);
      return;
    }

    if (this.userDataToUpdate["address"].length > 100) {
      let message = globals.addressLength;
      this.ut.toggleSplashscreen(false);
      this.showErrorsMessages(message);
      return;
    }

    let dataSession = this.ut.getLocalSession();

    let userDataUpdate = {
      documento: dataSession["documento"] + "",
      //"adicional": dataSession['adicional'] + '',
      //"email": this.userDataToUpdate['email'] + '',
      celular: this.userDataToUpdate["cellphone"] + "",
      direccion: this.userDataToUpdate["address"] + "",
      fechaNacimiento: dataSession["fechaNacimiento"]
        ? dataSession["fechaNacimiento"]
        : "",
      tipoDocumento: dataSession["tipoDocumento"]
        ? dataSession["tipoDocumento"]
        : "",
      telefono: this.userDataToUpdate["phone"] + "",
      genero: dataSession["sexo"] ? dataSession["sexo"] : "",
    };

    let gtoken = this.userService.getGeneralToken();

    if (gtoken) {
      this.userService.updateDataUser(userDataUpdate).subscribe(
        (success:any) => {
          let result = success;

          if (result.respuesta) {
            this.userService.updatedSessionUser(userDataUpdate);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }

    let bodyHealthUser = {
      documento: dataSession["documento"] + "",
      adicional: dataSession["adicional"] + "",
      email: this.userDataToUpdate["email"] + "",
      numCelular: this.userDataToUpdate["cellphone"] + "",
      telefono: this.userDataToUpdate["phone"] + "",
      direccion: this.userDataToUpdate["address"] + "",
    };
    this.updateHealDataUser(bodyHealthUser);
  }

  updateHealDataUser(data) {
    this.userService.updateDataUserHealth(data).subscribe(
      (success) => {
        let result = success.json();
        this.saveAppoinment();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  saveAppoinment() {
    this.ut.toggleSplashscreen(true);
    let codMedico = "";
    if (this.scheduleAppoinment["codMedico"]) {
      codMedico = this.scheduleAppoinment["codMedico"]["codMedico"];
    } else {
      codMedico = this.codMedico;
    }

    let dataSession = this.ut.getLocalSession();
    let data = {
      documento: dataSession["documento"],
      adicional: dataSession["adicional"],
      convenio: this.scheduleAppoinment["convenio"],
      codPlan: this.scheduleAppoinment["codPlan"],
      tipoCita: this.scheduleAppoinment["tipoCita"]["tipoCita"],
      prefijo: this.scheduleAppoinment["tipoCita"]["prefijo"],
      codServicio: this.scheduleAppoinment["tipoCita"]["codigo"],
      lugarCita: this.scheduleAppoinment["lugarCita"],
      codMedico: this.codMedico,
      fechaCita: moment(this.scheduleAppoinment["fechaCita"]).format(
        "YYYY-MM-DD"
      ),
      horaCitaBD: this.scheduleAppoinment["horaCitaBD"],
      noPaciente: this.scheduleAppoinment["noPaciente"],
      email: this.userDataToUpdate["email"],
    };

    this.appoimentService.saveAppointment(data).subscribe(
      (success) => {
        let result = success.json();

        if (result.respuesta) {
          this.ut.toggleSplashscreen(false);
          if (result.respuesta.estado == "OK") {
            let message = result.mensaje;

            this.toastr.success(message, "Buen trabajo", {
              enableHtml: true,
              positionClass: "toast-middle-right",
              timeOut: 5000,
            });
          } else {
            let message = result.respuesta.mensaje;
            this.showErrorsMessages(message);
          }
        } else {
          if (result.estado === "PROCESO EXITOSO") {
            let message = result.mensaje;
            this.scheduleId = result.consecutivo;

            this.closeModal();

            this.toastr.success(message, "Buen trabajo", {
              enableHtml: true,
              positionClass: "toast-middle-right",
              timeOut: 5000,
            });
            this.router.navigate(["/vacunasCovid/citas"]);
            // this.showButtonsPayment = true;

            // this.modalRef = this.modalService.show(
            //   this.modalScheduleAppoiment,
            //   Object.assign(
            //     { backdrop: "static" },
            //     { class: "gray modal-lg cf-modal" }
            //   )
            // );
            this.ut.toggleSplashscreen(false);
          } else {
            this.ut.toggleSplashscreen(false);
            let message = result.mensaje;
            this.showErrorsMessages(message);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  cancelAppoinment() {
    this.closeModal();
  }

  refreshView(): void {
    this.refresh.next();
  }

  showErrorsMessages(message) {
    this.ut.showErrorsModal(true, message);
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  gotoList() {
    this.closeModal();
    this.router.navigate(["salud/citas"]);
  }

  searchDataUser(template) {
    //Function to search contact data from user

    let user = this.ut.getLocalSession();
    let data = {
      documento: user["documento"],
      adicional: user["adicional"],
    };
    this.userService.getDataUserHealth(data).subscribe(
      (success) => {
        let response = success.json();

        if (response.respuesta) {
          if (response.respuesta.estado == "OK") {
            this.userDataToUpdate["email"] = response.contactoUsuario.email;
            this.userDataToUpdate["phone"] = response.contactoUsuario.telefono;
            this.userDataToUpdate["cellphone"] =
              response.contactoUsuario.telCelular;
            this.userDataToUpdate["address"] =
              response.contactoUsuario.direccion;
            this.userDataToUpdate["newUser"] = true;

            if (this.userDataToUpdate.email) {
              this.aFormGroup.controls["userEmail"].patchValue(
                this.userDataToUpdate["email"],
                { onlySelf: true }
              );
              // this.aFormGroup.controls['userEmail'].disable();
            }
            this.openModal(template);
          } else {
            let message = response.respuesta.mensaje;
            this.showErrorsMessages(message);
          }
        } else {
          let message = response.mensaje;
          this.showErrorsMessages(message);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  confirmPayAppoinment() {
    let title = globals.redirectTitleEcollect;
    let message = globals.redirectMessageEcollect;
    this.ut.showConfirmModal(true, title, message,"");
  }

  payAppoinment() {
    this.ut.toggleSplashscreen(true);
    let dataSession = this.ut.getLocalSession();
    let url =
      this.redirectPath +
      "salud/citas/resumen-pago?e541f24f=" +
      this.scheduleId;

    let data = {
      CreateTransactionPayment: {
        entityCode: "10577",
        srvCode: "10001",
        transValue: this.scheduleAppoinment["value"],
        urlRedirect: url,
        numeroIdentificacion: dataSession["documento"],
        identificadorProducto: this.scheduleId,
        nombreApellido: dataSession["user"],
        tipoDocumento: dataSession["tipoDocumento"],
        direccionResidencia: this.userDataToUpdate["address"],
        celular: this.userDataToUpdate["cellphone"],
        emailConfirmacion: this.userDataToUpdate["email"],
        codigoArea: "2",
        codigoServicio: "2",
        codigoSubservicio: "2",
        invoice: "",
      },
    };

    this.paymentService.paymentData(data).subscribe(
      (response) => {
        let result = response;

        this.validateResponse(result, this.scheduleAppoinment["value"]);
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  validateResponse(data, ValorTotal) {
    let code = data["returnCode"];
    let ticket = data["ticketId"];
    let url = data["eCollectUrl"];
    let total = ValorTotal;

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
      /**********CREAMOS REGISTRO INICIAL DE LA TRANSACCIÓN EN CONFA****************/

      let dataSession = this.ut.getLocalSession();
      let body = {
        area: "2",
        servicio: "2",
        subServicio: "2",
        productoId: this.scheduleId + "",
        identificacion: dataSession["documento"] + "",
        bonoPactoColectivo: false,
        valorTotal: total + "",
        valorPago: ValorTotal + "",
        valorBono: "0",
        ticketId: ticket + "",
        estadoTransaccion: code + "",
        urlPago: url + "",
      };

      this.paymentService.createRegisterConfa(body).subscribe(
        (response:any) => {
          let result = response;

          if (result.estado == "OK") {
            window.open(url, "_parent");
            this.ut.toggleSplashscreen(false);
          } else {
            this.ut.toggleSplashscreen(false);
            this.toastr.error(result.mensaje, "Recuerda", {
              enableHtml: true,
              positionClass: "toast-middle-right",
              timeOut: 5000,
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  validateExtension(limit, field) {
    if (
      this.ut.validateExtension(limit, this.userDataToUpdate[field].toString())
    ) {
      this.userDataToUpdate[field].toString().slice(0, limit);
    }
  }

  validateNumber(field) {
    if (!this.ut.validateNumber(this.userDataToUpdate[field])) {
      let text = this.userDataToUpdate[field];
      this.userDataToUpdate[field] = text.substring(0, text.length - 1);
    }
  }
}
