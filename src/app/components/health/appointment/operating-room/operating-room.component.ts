import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as _globals from "src/app/globals";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { UtilitiesService } from "src/app/services/general/utilities.service";
import { QuirofanosService } from "src/app/services/quirofanos/quirofanos.service";
import { UserService } from "src/app/services/user/user.service";
import * as _ from "lodash";
declare var $;

@Component({
  selector: "app-operating-room",
  templateUrl: "./operating-room.component.html",
  styleUrls: ["./operating-room.component.scss"],
})
export class OperatingRoomComponent implements OnInit {
  public main_appointments: string = _globals.main_appointments;
  public main_health: string = _globals.main_health;

  formScheduleRoom: UntypedFormGroup;
  aseguradoras: String[] = [];
  tiposAseguramiento: String[] = [];
  especialidades: String[] = [];
  especialistas: String[] = [];

  public numSteps: number;
  public currentStep: number = 1;
  public step = 0;

  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;

  modalSwitch: boolean;
  especialidadValidator: boolean = false;
  especialistaValidator: boolean = false;

  public userData = {
    direccion: "",
    telefono: "",
    telCelular: "",
    email: "",
  };

  public data = {
    documento: "",
    adicional: "",
    tipoDocumento: "",
    nombre: "",
  };

  constructor(
    private formBuilder: UntypedFormBuilder,
    private quirofanoService: QuirofanosService,
    public ut: UtilitiesService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.numSteps = 3;
    this.currentStep = 1;
    this.getDatosForm();
    this.findUserData();
    this.createForm();
    this.ut.setStepBreadCrumbs.subscribe((res) => {
      if (this.currentStep > 1) {
        this.currentStep = this.currentStep - 1;
      }
      if (this.currentStep == 1) {
        this.step = 0;
        this.main_appointments = "/quirofanos/citas";
      }
    });
  }

  getDatosForm() {
    this.quirofanoService.getDataForm().subscribe((success) => {
      let result = success;
      this.aseguradoras = result.aseguradoras;
      this.tiposAseguramiento = result.tiposAseguramiento;
      this.especialidades = result.especialidades;
    });
  }

  findUserData() {
    let dataSession = this.ut.getLocalSession();
    this.data = {
      documento: dataSession["documento"],
      adicional: dataSession["adicional"],
      tipoDocumento: dataSession["tipoDocumento"],
      nombre: dataSession["user"],
    };

    this.userService.getDataUserHealth(this.data).subscribe(
      (success) => {
        let response = success;
        if (response.contactoUsuario) {
          this.userData.direccion = response.contactoUsuario["direccion"];
          this.userData.telefono = response.contactoUsuario["telefono"];
          this.userData.telCelular = response.contactoUsuario["telCelular"];
          this.userData.email = response.contactoUsuario["email"];
          localStorage.setItem("userInfo", JSON.stringify(this.userData));
          this.ut.toggleSplashscreen(false);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  createForm() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo == null) {
      this.findUserData();
    }

    this.formScheduleRoom = this.formBuilder.group({
      numeroDocumento: [
        this.data["documento"],
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
          Validators.pattern("^[0-9]+"),
        ],
      ],
      tipoDocumento: [this.data["tipoDocumento"], [Validators.required]],
      nombre: [this.data["nombre"]],
      email: [
        userInfo.email,
        [
          Validators.required,
          Validators.pattern(
            "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
            "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
          ),
          Validators.email,
        ],
      ],

      telefono: [
        userInfo.telefono,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
          Validators.pattern("^[0-9]+"),
        ],
      ],
      celular: [
        userInfo.telCelular,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(15),
          Validators.pattern("^[0-9]+"),
        ],
      ],
      nombreNotificacion: [this.data["nombre"], [Validators.required]],
      telefonoAcudiente: [
        userInfo.telCelular,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(10),
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        ],
      ],

      aseguradora: ["", [Validators.required]],
      tipoAseguramiento: ["", [Validators.required]],
      numeroAutorizacion: ["", [Validators.required, Validators.maxLength(20)]],
      nombreProcedimiento: [
        "",
        [Validators.required, Validators.maxLength(500)],
      ],
      especialidad: ["", [Validators.required]],
      nombreEspecialista: ["", [Validators.required]],
      backUpEspecialidad: [""],
      backUpnombreEspecialista: ["", [Validators.maxLength(30)]],

      cedulaAdicional: [
        "",
        [Validators.required],
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
      ],

      documentoIdentidad: ["", [Validators.required]],
      autorizacion: ["", [Validators.required]],
      historiaClinica: ["", [Validators.required]],
      otrosDocumentos: [""],
      observacionAdicional: [""],
    });
  }

  onSubmit() {
    this.ut.toggleSplashscreen(true);
    const self = this;
    const controls = this.formScheduleRoom.controls;
    if (
      //this.f.documentoIdentidad.invalid ||
      this.f.autorizacion.invalid ||
      this.f.historiaClinica.invalid
    ) {
      this.ut.toggleSplashscreen(false);
      Object.keys(controls).forEach((controlName) => {
        if (
          //controlName == "documentoIdentidad" ||
          controlName == "autorizacion" ||
          controlName == "historiaClinica"
        ) {
          controls[controlName].markAsTouched();
        }
      });
    } else {
      let body = {
        tipo_doc: this.f.tipoDocumento.value,
        documento: this.f.numeroDocumento.value,
        nombre_completo: this.f.nombre.value,
        adicional: "01",
        aseguradora: this.f.aseguradora.value,
        tipo_aseguramiento: this.f.tipoAseguramiento.value,
        numero_autorizacion: this.f.numeroAutorizacion.value,
        nombre_procedimiento: this.f.nombreProcedimiento.value,
        especialidad: this.f.especialidad.value,
        nombre_especialista: this.f.nombreEspecialista.value,
        correo_electronico: this.f.email.value,
        numero_telefono: this.f.telefono.value.toString(),
        numero_celular: this.f.celular.value.toString(),
        nombre_contacto: this.f.nombreNotificacion.value,
        telefono_contacto: this.f.telefonoAcudiente.value.toString(),
        documento_identidad: this.f.documentoIdentidad.value,
        autorizacion: this.f.autorizacion.value,
        historia_clinica: this.f.historiaClinica.value,
        otros_documentos: this.f.otrosDocumentos.value,
        observacion_adicional: this.f.observacionAdicional.value,
      };

      if (body.especialidad == "Otra") {
        body.especialidad = this.f.backUpEspecialidad.value;
        body.nombre_especialista = this.f.backUpnombreEspecialista.value;
      }
      if (body.nombre_especialista == "Otro") {
        body.nombre_especialista = this.f.backUpnombreEspecialista.value;
      }

      let numDoc={
        numero_documento: this.f.numeroDocumento.value,
      }
      this.quirofanoService.getRadicacionRegistrada(numDoc).subscribe((res) => {
        let resultadoRadicacion = res;
        var info = resultadoRadicacion.secuencia.replace("\n", "<br/>");
        if (info == "") {

          this.quirofanoService.sendForm(body).subscribe((res) => {
            let result = res;
            if (result.estado == "OK") {
              this.ut.toggleSplashscreen(false);
              this.ut.messageTitleModal = `Tu radicado es ${result.secuencia}.`;
              this.ut.messageModal = `- Tendremos 5 días hábiles para verificar si cumples con todos los requisitos para la programación del procedimiento quirúrgico.`;
              this.ut.messageModal2 = `- Si cumples con los requisitos, procuraremos programar tu procedimiento en los 30 días hábiles de tu radicación. `;
              this.ut.messageModal3 = `- Serás contactado y te daremos toda la información pertinente. `;
              this.ut.messageModal4 = `- Si no cumples con todos los requisitos o te falta algún documento, nos comunicaremos por vía telefónica o correo electrónico.`;
              $(".btn-modal-success").click();
              this.router.navigate["/quirofanos/citas"];
              localStorage.removeItem("userInfo");
            } else {
              this.ut.toggleSplashscreen(false);
              this.ut.messageTitleModal = "Algo ha salido mal";
              this.ut.messageModal = result.mensaje;
              $(".btn-modal-error").click();
            }
          });
        } else {
          this.showConfirm("Actualmente ya cuentas con una o varias radicaciones de cirugia"
            , info.replace('<table', '<table class="table table-striped"'),
            "¿Deseas radicar otra cirugia?");
          this.ut.toggleSplashscreen(false);
          const response = this.ut._responseModalConfirm.subscribe((res) => {
            if (res) {
              this.ut.toggleSplashscreen(true);
              this.quirofanoService.sendForm(body).subscribe((res) => {
                let result = res;
                if (result.estado == "OK") {
                  this.ut.toggleSplashscreen(false);
                  this.ut.messageTitleModal = `Tu radicado es ${result.secuencia}.`;
                  this.ut.messageModal = `- Tendremos 5 días hábiles para verificar si cumples con todos los requisitos para la programación del procedimiento quirúrgico.`;
                  this.ut.messageModal2 = `- Si cumples con los requisitos, procuraremos programar tu procedimiento en los 30 días hábiles de tu radicación. `;
                  this.ut.messageModal3 = `- Serás contactado y te daremos toda la información pertinente. `;
                  this.ut.messageModal4 = `- Si no cumples con todos los requisitos o te falta algún documento, nos comunicaremos por vía telefónica o correo electrónico.`;
                  $(".btn-modal-success").click();
                  this.router.navigate["/quirofanos/citas"];
                  localStorage.removeItem("userInfo");
                } else {
                  this.ut.toggleSplashscreen(false);
                  this.ut.messageTitleModal = "Algo ha salido mal";
                  this.ut.messageModal = result.mensaje;
                  $(".btn-modal-error").click();
                }
              });
            } else {

            }
            response.unsubscribe();
          });
        }

      });
    }
  }

  submitEnsuranceInfo() {
    const self = this;
    const controls = this.formScheduleRoom.controls;
    if (
      this.f.aseguradora.invalid ||
      this.f.tipoAseguramiento.invalid ||
      this.f.numeroAutorizacion.invalid ||
      this.f.nombreProcedimiento.invalid ||
      this.f.especialidad.invalid ||
      this.f.nombreEspecialista.invalid ||
      this.f.backUpEspecialidad.invalid ||
      this.f.backUpnombreEspecialista.invalid
    ) {
      Object.keys(controls).forEach((controlName) => {
        if (
          controlName == "aseguradora" ||
          controlName == "tipoAseguramiento" ||
          controlName == "numeroAutorizacion" ||
          controlName == "nombreProcedimiento" ||
          controlName == "especialidad" ||
          controlName == "nombreEspecialista" ||
          controlName == "backUpEspecialidad" ||
          controlName == "backUpnombreEspecialista"
        ) {
          controls[controlName].markAsTouched();
        }
      });
    } else {
      this.nextStep();
    }
  }

  submitPersonalInfo() {
    const self = this;
    const controls = this.formScheduleRoom.controls;

    if (
      this.f.numeroDocumento.invalid ||
      this.f.nombre.invalid ||
      this.f.email.invalid ||
      this.f.telefono.invalid ||
      this.f.celular.invalid ||
      this.f.nombreNotificacion.invalid ||
      this.f.telefonoAcudiente.invalid
    ) {
      Object.keys(controls).forEach((controlName) => {
        if (
          controlName == "numeroDocumento" ||
          controlName == "nombre" ||
          controlName == "email" ||
          controlName == "telefono" ||
          controlName == "celular" ||
          controlName == "nombreNotificacion" ||
          controlName == "telefonoAcudiente"
        ) {
          controls[controlName].markAsTouched();
        }
      });
    } else {
      this.nextStep();
    }
  }

  nextStep() {
    if (this.currentStep + 1 <= this.numSteps) {
      this.currentStep = this.currentStep + 1;
      this.step = this.step + 1;
      if (this.currentStep > 1) {
        this.main_appointments = "/quirofano/citas/agendarCita";
      }
    }
  }

  getFile(fileInput: any, campo: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ["image/png", "image/jpeg", "application/pdf"];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError = "Maximum size allowed is " + max_size / 1000 + "Mb";

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = "Only Images are allowed ( JPG | PNG )";
        campo.invalid;
        campo.value = null;
        campo._pendingValue = null;
        campo.status = "INVALID";
        return false;
      } else {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (e.total < max_size) {
            const imgBase64Path = e.target.result;
            campo.value = imgBase64Path;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;
          }
        };

        reader.readAsDataURL(fileInput.target.files[0]);
      }
    }
  }

  capturarAseguradora(event) {
    this.formScheduleRoom.get("aseguradora").setValue(event);
  }

  capturarTipo(event) {
    this.formScheduleRoom.get("tipoAseguramiento").setValue(event);
  }

  capturarEspecialidad(event) {
    if (event == "Otra") {
      this.formScheduleRoom.get("nombreEspecialista").setValidators(null);
      this.formScheduleRoom.get("especialidad").setValidators(null);
      this.formScheduleRoom
        .get("backUpEspecialidad")
        .setValidators([Validators.required, Validators.maxLength(30)]);
      this.formScheduleRoom
        .get("backUpnombreEspecialista")
        .setValidators(Validators.maxLength(30));
      this.formScheduleRoom.get("backUpnombreEspecialista").setValue("");
      this.especialidadValidator = true;
      this.especialistaValidator = false;
    } else {
      this.especialidades.forEach((esp) => {
        if (esp["cod_esp"] == event) {
          this.especialistas = esp["especialistas"];
          this.formScheduleRoom.get("especialidad").setValue(event);
          this.formScheduleRoom.get("nombreEspecialista").setValue("");
        }
      });

      this.formScheduleRoom
        .get("nombreEspecialista")
        .setValidators(Validators.required);
      this.formScheduleRoom
        .get("especialidad")
        .setValidators(Validators.required);
      this.formScheduleRoom.get("backUpEspecialidad").setValidators(null);
      this.formScheduleRoom.get("backUpnombreEspecialista").setValue("");
      this.formScheduleRoom.get("backUpEspecialidad").setValue("");
      this.especialidadValidator = false;
      this.especialistaValidator = false;
    }
    this.formScheduleRoom.get("nombreEspecialista").updateValueAndValidity();
    this.formScheduleRoom.get("especialidad").updateValueAndValidity();
    this.formScheduleRoom.get("backUpEspecialidad").updateValueAndValidity();
    this.formScheduleRoom
      .get("backUpnombreEspecialista")
      .updateValueAndValidity();
  }

  capturarEspecialista(event) {
    if (event == "Otro") {
      this.formScheduleRoom.get("nombreEspecialista").setValue(event);
      this.formScheduleRoom.get("nombreEspecialista").setValidators(null);
      this.formScheduleRoom
        .get("backUpnombreEspecialista")
        .setValidators([Validators.required, Validators.maxLength(30)]);
      this.especialistaValidator = true;
    } else {
      this.formScheduleRoom.get("nombreEspecialista").setValue(event);
      this.formScheduleRoom
        .get("nombreEspecialista")
        .setValidators(Validators.required);
      this.formScheduleRoom
        .get("backUpnombreEspecialista")
        .setValidators(Validators.maxLength(30));
      this.especialistaValidator = false;
    }
    this.formScheduleRoom.get("nombreEspecialista").updateValueAndValidity();
    this.formScheduleRoom
      .get("backUpnombreEspecialista")
      .updateValueAndValidity();
  }

  // hace la activacion del inputfile desde los iconos laterales
  loadfile(id: String) {
    $("#" + id).click();
  }

  get f() {
    return this.formScheduleRoom.controls;
  }

  get getAseguradora() {
    return (
      this.formScheduleRoom.get("aseguradora").invalid &&
      this.formScheduleRoom.get("aseguradora").touched
    );
    this.formScheduleRoom
      .get("backUpnombreEspecialista")
      .updateValueAndValidity();
  }

  // hace la activacion del inputfile desde los iconos laterales



  get getTipoAseguramiento() {
    return (
      this.formScheduleRoom.get("tipoAseguramiento").invalid &&
      this.formScheduleRoom.get("tipoAseguramiento").touched
    );
  }

  get getNumeroAutorizacion() {
    return (
      this.formScheduleRoom.get("numeroAutorizacion").invalid &&
      this.formScheduleRoom.get("numeroAutorizacion").touched
    );
  }

  get getNombreProcedimiento() {
    return (
      this.formScheduleRoom.get("nombreProcedimiento").invalid &&
      this.formScheduleRoom.get("nombreProcedimiento").touched
    );
  }

  get getEspecialidad() {
    return (
      this.formScheduleRoom.get("especialidad").invalid &&
      this.formScheduleRoom.get("especialidad").touched
    );
  }

  get getNombreEspecialista() {
    return (
      this.formScheduleRoom.get("nombreEspecialista").invalid &&
      this.formScheduleRoom.get("nombreEspecialista").touched
    );
  }

  get getCorreoNotificacion() {
    return (
      this.formScheduleRoom.get("correoNotificacion").invalid &&
      this.formScheduleRoom.get("correoNotificacion").touched
    );
  }

  get getTelefonoNotificacion() {
    return (
      this.formScheduleRoom.get("telefonoNotificacion").invalid &&
      this.formScheduleRoom.get("telefonoNotificacion").touched
    );
  }

  get getNombreNotificacion() {
    return (
      this.formScheduleRoom.get("nombreNotificacion").invalid &&
      this.formScheduleRoom.get("nombreNotificacion").touched
    );
  }

  get getTelefonoAcudiente() {
    return (
      this.formScheduleRoom.get("telefonoAcudiente").invalid &&
      this.formScheduleRoom.get("telefonoAcudiente").touched
    );
  }

   //get getDocumentoIdentidad() {
    //return (
      //this.formScheduleRoom.get("documentoIdentidad").invalid &&
      //this.formScheduleRoom.get("documentoIdentidad").touched
    //);
  //}

  get getAutorizacion() {
    return (
      this.formScheduleRoom.get("autorizacion").invalid &&
      this.formScheduleRoom.get("autorizacion").touched
    );
  }

  get getHistoriaClinica() {
    return (
      this.formScheduleRoom.get("historiaClinica").invalid &&
      this.formScheduleRoom.get("historiaClinica").touched
    );
  }

  get getBackUpEspecialidad() {
    return (
      this.formScheduleRoom.get("backUpEspecialidad").invalid &&
      this.formScheduleRoom.get("backUpEspecialidad").touched
    );
  }

  get getBackUpEspecialista() {
    return (
      this.formScheduleRoom.get("backUpnombreEspecialista").invalid &&
      this.formScheduleRoom.get("backUpnombreEspecialista").touched
    );
  }

  showConfirm(tittle, message, message2) {
    this.ut.showConfirmModal(true, tittle, message, message2);
  }
}
