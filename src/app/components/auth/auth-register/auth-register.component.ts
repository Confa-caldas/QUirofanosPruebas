import { Component, OnInit, ViewChild } from "@angular/core";
import { SingletonService } from "../../../singleton.service";
import { BsModalRef } from 'ngx-bootstrap/modal';

import { BsModalService } from "ngx-bootstrap/modal";
import { Router } from "@angular/router";
import { DataService } from "../../../data.service";
import { TranslateService } from "@ngx-translate/core";
import { ApirestService } from "../../../apirest.service";
import { ToastrService } from "ngx-toastr";
import { RestProvider } from "../../../providers/rest/rest";
import { Md5 } from "ts-md5/dist/md5";
import swal from "sweetalert2";
import { AuthService } from "src/app/services/auth/auth.service";
import { UtilitiesService } from "src/app/services/general/utilities.service";
import { Subscription } from "rxjs";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-auth-register",
  templateUrl: "./auth-register.component.html",
  styleUrls: ["./auth-register.component.scss"],
})
export class AuthRegisterComponent implements OnInit {
  //Variables para el login
  public userRegistry = {
    tipoDocumento: "",
    document: "",
    address: "",
    phone: "",
    cellphone: "",
    email: "",
    confirm_email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    second_name: "",
    first_last_name: "",
    second_last_name: "",
    accept_terms: false,
    accept_habeas: false,
    gender: "",
    fechaNacimiento: "",
    category: "",
  };

  public disabled_inputs = false;

  modalRegister: BsModalRef;

  @ViewChild("registerModal", { static: false }) registerModal;

  private unsubscribes: Subscription[] = [];

  public ViewRegisterForm = true;

  public spinLoader = false;

  /**
   * Data form
   */
  public aFormGroup: UntypedFormGroup;

  constructor(
    public singleton: SingletonService,
    private modalService: BsModalService,
    private router: Router,
    public dataService: DataService,
    private translate: TranslateService,
    public service: ApirestService,
    private toastr: ToastrService,
    public provider: RestProvider,
    public auth: AuthService,
    private ut: UtilitiesService,
    private formBuilder: UntypedFormBuilder,
  ) {}

  ngOnInit() {
    let openModal = this.auth._openModalRegisterUser.subscribe((res:any) => {
      if (res.value) {
        let data = res.data;

        if (data.first_name != "") {
          this.disabled_inputs = true;
        } else {
          this.disabled_inputs = false;
        }

        this.userRegistry = {
          tipoDocumento: "",
          document: data.document,
          address: "",
          phone: "",
          cellphone: "",
          email: "",
          confirm_email: "",
          password: "",
          confirm_password: "",
          first_name: data.first_name,
          second_name: data.second_name,
          first_last_name: data.first_last_name,
          second_last_name: data.second_last_name,
          accept_terms: false,
          accept_habeas: false,
          fechaNacimiento: data.fechaNacimiento,
          category: data.category,
          gender: data.sexo,
        };

        this.createForm(this.userRegistry);
      }
    });

    this.unsubscribes.push(openModal);
  }

  ngOnDestroy() {
    this.unsubscribes.forEach((sb) => sb.unsubscribe());
  }

  /**
   * Event for create form
   */
  createForm(data: any) {
    this.aFormGroup = this.formBuilder.group({
      document: [
        this.userRegistry.document,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ]),
      ],
      first_name: [
        this.userRegistry.first_name,
        Validators.compose([
          Validators.required,
          Validators.pattern("[A-Za-zá-úÁ-Ú ]*"),
        ]),
      ],
      second_name: [
        this.userRegistry.second_name,
        Validators.compose([Validators.pattern("[A-Za-zá-úÁ-Ú ]*")]),
      ],
      first_last_name: [
        this.userRegistry.first_last_name,
        Validators.compose([
          Validators.required,
          Validators.pattern("[A-Za-zá-úÁ-Ú ]*"),
        ]),
      ],
      second_last_name: [
        this.userRegistry.second_last_name,
        Validators.compose([Validators.pattern("[A-Za-zá-úÁ-Ú ]*")]),
      ],
      email: [
        this.userRegistry.email,
        Validators.compose([Validators.required]),
      ],
      confirm_email: [
        this.userRegistry.confirm_email,
        Validators.compose([Validators.required]),
      ],
      password: [
        this.userRegistry.password,
        Validators.compose([Validators.required]),
      ],
      confirm_password: [
        this.userRegistry.confirm_password,
        Validators.compose([Validators.required]),
      ],
      accept_habeas: [
        this.userRegistry.accept_habeas,
        Validators.compose([Validators.required]),
      ],
    });

    if (this.userRegistry.first_name != "") {
      this.aFormGroup.controls["first_name"].disable();
      this.aFormGroup.controls["second_name"].disable();
      this.aFormGroup.controls["first_last_name"].disable();
      this.aFormGroup.controls["second_last_name"].disable();
    }
    this.openModalRegister();
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

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  openModalRegister() {
    this.modalRegister = this.modalService.show(this.registerModal, {
      class: "modal-lg",
      ignoreBackdropClick: true,
    });
  }

  closeModal() {
    if (this.ViewRegisterForm) {
      if (this.modalRegister) {
        this.modalRegister.hide();
      }

      this.userRegistry = {
        tipoDocumento: "",
        document: "",
        address: "",
        phone: "",
        cellphone: "",
        email: "",
        confirm_email: "",
        password: "",
        confirm_password: "",
        first_name: "",
        second_name: "",
        first_last_name: "",
        second_last_name: "",
        accept_terms: false,
        accept_habeas: false,
        gender: "",
        fechaNacimiento: "",
        category: "",
      };
    }

    this.ViewRegisterForm = true;
  }

  validateDocumentregister() {
    let values = /^[0-9]+$/;
    if (
      !values.test(this.userRegistry.document) ||
      this.userRegistry.document.length > 15
    ) {
      // this.userlogin.document = "";
      let text = this.userRegistry.document;
      this.userRegistry.document = text.slice(0, -1);
    }
  }

  register() {
    const controls = this.aFormGroup.controls;

    /** check form */
    if (this.aFormGroup.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched(),
      );
      return;
    }

    this.userRegistry["document"] = controls["document"].value.toString();
    this.userRegistry["first_name"] = controls["first_name"].value.toString();
    this.userRegistry["second_name"] = controls["second_name"].value.toString();
    this.userRegistry["first_last_name"] = controls[
      "first_last_name"
    ].value.toString();
    this.userRegistry["second_last_name"] = controls[
      "second_last_name"
    ].value.toString();
    this.userRegistry["email"] = controls["email"].value.toString();
    this.userRegistry["confirm_email"] = controls[
      "confirm_email"
    ].value.toString();
    this.userRegistry["password"] = controls["password"].value.toString();
    this.userRegistry["confirm_password"] = controls[
      "confirm_password"
    ].value.toString();
    this.userRegistry["accept_habeas"] = controls["accept_habeas"].value;

    let url = this.singleton.url + "/confirm";

    if (this.router.url.search("salud") > 0) {
      url += "/salud";
    }

    if (this.router.url.search("alojamiento") > 0) {
      url += "/alojamiento";
    }

    this.ut.toggleSplashscreen(true);
    let body = {
      sistema: "Portal Confa",
      linkMensaje: url,
      parametro: "34240997a16763c011134c570fcc149e",
      remitente: "Portal Confa",
      asunto: "Confirmación de registro",
      usuario: {
        documento: this.userRegistry.document,
        direccion: this.userRegistry.address,
        telefono: this.userRegistry.phone,
        sexo: this.userRegistry.gender,
        categoria: this.userRegistry.category,
        celular: this.userRegistry.cellphone,
        correo: this.userRegistry.email,
        clave: this.userRegistry.password,
        codBeneficiario: "",
        nombreBeneficiario: "",
        fechaNacimiento: this.userRegistry.fechaNacimiento,
        fechaRegistro: "",
        documentoTrabajador: "",
        primerNombre: this.userRegistry.first_name,
        segundoNombre: this.userRegistry.second_name,
        primerApellido: this.userRegistry.first_last_name,
        segundoApellido: this.userRegistry.second_last_name,
        link: this.singleton.url,
        existeUsuario: true,
        usuarioNasfa: true,
        sistemaActualizacion: "",
        correoMd5: "" + Md5.hashStr(this.userRegistry.email),
        aceptaHabeas: this.userRegistry.accept_habeas,
      },
    };

    //we need to validate the required fields
    let errorMessage = "";
    if (
      this.userRegistry.first_name === "" ||
      this.userRegistry.first_last_name === "" ||
      this.userRegistry.document === "" ||
      this.userRegistry.email === "" ||
      this.userRegistry.password === ""
    ) {
      errorMessage = "Los campos marcados con * son obligatorios. ";
      this.ut.toggleSplashscreen(false);
    } else {
      if (this.userRegistry.email !== this.userRegistry.confirm_email) {
        errorMessage =
          "Recuerda que los campos email y confirmar email deben coincidir.";
        this.ut.toggleSplashscreen(false);
      } else {
        if (this.userRegistry.password !== this.userRegistry.confirm_password) {
          errorMessage =
            "Los campos 'Contraseña' y 'Confirmar contraseña' deben coincidir.";
          this.ut.toggleSplashscreen(false);
        } else {
          if (this.userRegistry.accept_habeas === false) {
            errorMessage =
              "Debes aceptar la Política de de tratamiento de datos.";
            this.ut.toggleSplashscreen(false);
          } else {
          }
        }
      }
    }

    if (errorMessage === "") {
      this.spinLoader = true;
      let bodyAuth = {
        parametro1: this.singleton.parametro1,
        parametro2: this.singleton.parametro2,
      };

      this.provider.queryJson("/auth", bodyAuth, 1).subscribe((response:any) => {
        let result = response;
        if (undefined !== result) {
          let token: string = "Bearer " + result.token;

          let bodyValidate = {
            documento: "" + this.userRegistry.document,
          };

          //first we need to validate the the user doesn't exists
          this.provider
            .queryJson("/confa/metodo1", bodyValidate, 1, token)
            .subscribe(
              (response:any) => {
                let result = response;

                let exist_user = result.usuario["existeUsuario"];
                this.spinLoader = false;
                if (!exist_user) {
                  this.provider
                    .queryJson("/confa/metodo12", body, 1, token)
                    .subscribe(
                      (response:any) => {
                        let result = response
                        this.ut.toggleSplashscreen(false);
                        if (result.respuesta === "") {
                          let mensaje = "Te hemos enviado un correo de confirmación. Debes confirmar para poder ingresar.";
                          //this.toastr.success(mensaje, 'Buen trabajo', {enableHtml: true, positionClass: 'toast-bottom-right'});
                          this.closeModal();
                          swal({
                            title: "Registro en proceso",
                            text: mensaje,
                            type: "success",
                            showCancelButton: false,
                            confirmButtonClass: "btn-success",
                            confirmButtonText: "Continuar",
                          });
                        } else {
                          this.spinLoader = false;
                          this.ut.toggleSplashscreen(false);
                          this.toastr.error(result.respuesta, "Lo sentimos", {
                            enableHtml: true,
                            positionClass: "toast-top-center",
                          });
                        }
                      },
                      (err) => {
                        if (err.status == 503) {
                          this.spinLoader = false;
                          this.ut.toggleSplashscreen(false);
                          this.toastr.error(
                            "Parece que no tienes conexión",
                            "Lo sentimos",
                            {
                              enableHtml: true,
                              positionClass: "toast-top-center",
                            },
                          );
                        }
                      },
                    );
                } else {
                  this.spinLoader = false;
                  this.ut.toggleSplashscreen(false);
                  this.toastr.error(
                    "Ya existe un usuario registrado con este número de documento.",
                    "Lo sentimos",
                    { enableHtml: true, positionClass: "toast-top-center" },
                  );
                }
              },
              (err) => {
                if (err.status == 503) {
                  this.spinLoader = false;
                  console.log("Parece que no tienes conexión");
                  this.ut.toggleSplashscreen(false);
                }
              },
            );
        }
      });
    } else {
      let message = errorMessage;
      this.toastr.error(message, "Recuerda", {
        enableHtml: true,
        positionClass: "toast-bottom-right",
      });
    }
  }
}
