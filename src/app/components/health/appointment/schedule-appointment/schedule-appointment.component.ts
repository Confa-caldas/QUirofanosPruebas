import { Component, OnInit } from "@angular/core";
import * as _globals from "src/app/globals";
import { DocumentTypeService } from "src/app/services/document/document-type.service";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { AppoinmentService } from "src/app/services/appoinment/appoinment.service";
import { UtilitiesService } from "src/app/services/general/utilities.service";
import { TranslateService } from "@ngx-translate/core";
import { TermsService } from "./../../../../services/user/terms.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-schedule-appointment",
  templateUrl: "./schedule-appointment.component.html",
  styleUrls: ["./schedule-appointment.component.scss"],
})
export class ScheduleAppointmentComponent implements OnInit {
  public main_health: string = _globals.main_health;
  public main_appointments: string = _globals.main_appointments;

  public numSteps: number;
  public currentStep: number = 1;

  public documentType = [];

  public scheduleAppoinment = {
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

  public appoinmentsTypes = [];
  public servicesList = [];

  /**
   * Data form
   */
  public aFormGroup: UntypedFormGroup;

  public userAgreements = [];
  public healthcareProfessionals = [];

  public step = 0;
  constructor(
    private documentTypeService: DocumentTypeService,
    private formBuilder: UntypedFormBuilder,
    private appoimentService: AppoinmentService,
    private ut: UtilitiesService,
    private translate: TranslateService,
    private termsService: TermsService,
    private toastr: ToastrService
  ) {
    this.documentType = this.documentTypeService.getAll();
    this.userAgreements = this.ut.geLocalSessionData("user_agreements");
  }

  ngOnInit() {
    this.numSteps = 2;
    this.currentStep = 1;
    this.createForm();
    this.ut.setStepBreadCrumbs.subscribe((res) => {
      if (this.currentStep > 1) {
        this.currentStep = this.currentStep - res;
      }

      if (this.currentStep == 1) {
        this.step = 0;
        this.main_appointments = "/quirofano/citas/";
      }
    });
  }

  /**
   * Event for create form
   */
  createForm() {
    this.aFormGroup = this.formBuilder.group({
      convenio: [
        "algo",
        // this.scheduleAppoinment.convenio,
        // Validators.compose([
        //   Validators.required,
        //   //Validators.minLength(6)
        // ]),
      ],
      tipoCita: [
        "algo2",
        // this.scheduleAppoinment.tipoCita,
        // Validators.compose([Validators.required]),
      ],
      // codServicio: [this.scheduleAppoinment.codServicio],
      codServicio: ["algo3"],
      codMedico: ["algo4"],
      // codMedico: [this.scheduleAppoinment.codMedico, Validators.required],
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

  getAppoinmentsTypes(event) {
    this.aFormGroup.controls["tipoCita"].patchValue(null);
    this.aFormGroup.controls["codServicio"].patchValue(null);
    this.aFormGroup.controls["codMedico"].patchValue(null);
    this.appoinmentsTypes = [];

    if (event.target.value == "") {
      return;
    }

    let data = {
      convenioId: event.target.value,
    };

    for (let i = 0; i < this.userAgreements.length; i++) {
      if (event.target.value == this.userAgreements[i].convenio) {
        this.scheduleAppoinment["codPlan"] = this.userAgreements[i].plan;
      }
    }

    this.appoimentService.getAppoinmentsTypes(data).subscribe(
      (success) => {
        let result = success.json();
        if (result.respuesta) {
          if (result.respuesta.estado == "OK") {
            this.appoinmentsTypes = result.citas;
          } else {
            let message = result.mensaje;
            this.showErrorsMessages(message);
          }
        } else {
          let message = result.mensaje;
          this.showErrorsMessages(message);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  showErrorsMessages(message) {
    this.ut.showErrorsModal(true, message);
  }

  onSelectAppoinmentsTypes(event) {
    this.scheduleAppoinment.tipoCita = event;
    this.aFormGroup.controls["codServicio"].patchValue(null);
    this.aFormGroup.controls["codMedico"].patchValue(null);
    this.scheduleAppoinment.codServicio = null;
    this.scheduleAppoinment.codMedico = null;
    this.servicesList = [];
    this.healthcareProfessionals = [];

    let length = this.appoinmentsTypes.length;
    if (length > 0) {
      let temp = [];
      for (let i = 0; i < length; i++) {
        if (this.appoinmentsTypes[i].tipoCita == event.tipoCita) {
          temp.push(this.appoinmentsTypes[i]);
        }
      }
      this.servicesList = temp;
    }

    this.getHealthcareProfessionals(event);
  }

  onSelectService(event) {
    this.aFormGroup.controls["codMedico"].patchValue(null);
    this.scheduleAppoinment.codMedico = null;
    this.scheduleAppoinment.codServicio = event;

    this.healthcareProfessionals = [];

    this.getHealthcareProfessionals(event);
  }

  onSelectProfessional(event) {
    this.scheduleAppoinment.codMedico = event;
  }

  getHealthcareProfessionals(event) {
    let data = {
      citaId: event.citaId,
      //"ubicacion":"ENE__"
    };

    this.appoimentService.gethealthcareProfessionals(data).subscribe(
      (success) => {
        let response = success.json();

        if (response.respuesta) {
          if (response.respuesta.estado == "OK") {
            this.healthcareProfessionals = response.medicos;
            // agrega el comodin para consultar todo de la bd
            // this.healthcareProfessionals.unshift({
            //   codMedico: "0cfs",
            //   nombre: "Cualquiera"
            // });
          } else {
            let message = response.mensaje;
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

  onDeSelectAppoinmentsTypes(event) {}

  submit() {
    const self = this;
    const controls = this.aFormGroup.controls;

    /** check form */
    if (this.aFormGroup.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.nextStep();
  }

  nextStep() {
    this.termsService.callTermsSevice(true);

    const accepTermsSubs = this.termsService._acceptTermsService.subscribe(
      (res) => {
        if (res) {
          if (this.currentStep + 1 <= this.numSteps) {
            this.currentStep = this.currentStep + 1;
            this.step = 1;
            if (this.currentStep > 1) {
              this.main_appointments = "/quirofano/citas/agendarCita";
            }
          }
        }
      }
    );
  }
}
