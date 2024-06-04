import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ApirestService } from "../apirest.service";
import { DataService } from "../data.service";
import { Router } from "@angular/router";
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from "@angular/animations";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { RestProvider } from "../providers/rest/rest";
import { Md5 } from "ts-md5/dist/md5";
import { SingletonService } from "../singleton.service";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit {
  //ENLACES PORTAL
  public home = "";
  public personas = "";
  public empresas = "";
  public acerca = "";
  public servicio_subsidio = "";
  public servicio_vivienda = "";
  public servicio_educacion = "";
  public servicio_recreacion = "";
  public servicio_credito = "";
  public servicio_salud = "";
  public contacto = "";
  public viveconfa = "";

  public ViewRegisterForm = true;

  //Variables para el login
  public userlogin = { document: "", password: "" };

  public user = {};
  public showCanvasLeft = false;
  public showCanvasRight = false;
  public menuXs = false;
  public showOverlay = false;
  public mediaQuery = "lg";
  public logued = false;
  public isCollapsed = true;
  public menu = true;

  public messageModal = "Ingresa para reservar o verificar tus reservas";
  public viewPass = true;

  public welcome;
  public loader = false;
  public disabled_inputs = false;

  public menuClass = "col-md-10";

  modalRef: BsModalRef;
  modalRegistry: BsModalRef;
  modalValidate: BsModalRef;

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
    fechaNacimiento: "",
    category: "",
    gender: "",
  };

  @ViewChild("login", { static: false }) login;
  constructor(
    private translate: TranslateService,
    public service: ApirestService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public provider: RestProvider,
    public singleton: SingletonService,
    public dataService: DataService,
    private cookieService: CookieService
  ) {
    this.home = this.singleton.portal + "/personas/servicios-en-linea/";
    this.personas = this.singleton.portal + "/";
    this.empresas = this.singleton.portal + "/empresas/";
    this.acerca = this.singleton.portal + "/personas/acerca-de-confa/";
    this.servicio_subsidio = this.singleton.portal + "/personas/subsidios/";
    this.servicio_vivienda = this.singleton.portal + "/personas/vivienda/";
    this.servicio_educacion = this.singleton.portal + "/personas/educacion/";
    this.servicio_recreacion = this.singleton.portal + "/personas/recreacion/";
    this.servicio_credito = this.singleton.portal + "/personas/creditos/";
    this.servicio_salud = this.singleton.portal + "/personas/salud/";
    this.contacto = this.singleton.portal + "/personas/contacto/";
    this.viveconfa = this.singleton.portal + "/personas/servicios-en-linea/";
  }

  ngOnInit() {
    if (
      null == localStorage.getItem("ptoken") ||
      "null" == localStorage.getItem("ptoken") ||
      undefined == localStorage.getItem("ptoken")
    ) {
      //  this.router.navigate(['/']);
    } else {
      this.getUser();
      // this.logued = true;
    }

    this.dataService.user.subscribe((data) => {
      this.getUser();
    });
    this.getMediaQuery();
  }

  async welcomefunc() {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user["sexo"] == "M") {
      this.welcome =
        "Bienvenido " +
        user.primerNombre +
        " " +
        user.segundoNombre +
        ", ahora puedes comenzar tu proceso de reserva de alojamiento.";
    } else if (user["sexo"] == "F") {
      this.welcome =
        "Bienvenida " +
        user.primerNombre +
        " " +
        user.segundoNombre +
        ", ahora puedes comenzar tu proceso de reserva de alojamiento.";
    } else {
      this.welcome =
        "Bienvenido " +
        user.primerNombre +
        " " +
        user.segundoNombre +
        ", ahora puedes comenzar tu proceso de reserva de alojamiento.";
    }

    this.showOverlay = true;
    await this.sleep(5000);
    this.showOverlay = false;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getMediaQuery() {
    let width = screen.width;

    if (width <= 575.98) {
      this.mediaQuery = "xs";
      this.menuXs = true;
      this.menuClass = "col-md-12";
    } else if (width <= 768.98) {
      this.mediaQuery = "sm";
      this.menuXs = true;
      this.menuClass = "col-md-12";
    } else if (width <= 991.98) {
      this.mediaQuery = "md";
      this.menuClass = "col-md-12";
    } else if (width <= 1199.98) {
      this.mediaQuery = "lg";
    }
  }

  openMenu(option) {
    if (option == true) {
      this.menu = false;
    } else {
      this.menu = true;
    }
  }

  /**
   *  It gets the user from the local storage
   **/
  getUser() {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (this.user) {
      this.logued = true;
      this.translate.use("es");
    } else {
      this.logued = false;
    }
  }

  /**
   * Logout from api and redirect to login
   */
  async logout() {
    let body = new FormData();
    localStorage.clear();
    this.router.navigate(["/"]);
    this.logued = false;
    this.singleton.loggedIn = false;
    this.welcome = "Tu sesión ha finalizado";
    this.showOverlay = true;
    await this.sleep(3000);
    this.showOverlay = false;
    this.userlogin = { document: "", password: "" };

    this.dataService.changeUser(null);
    this.loader = false;
  }

  openCanvas(canvas) {
    if (canvas == "left") {
      this.showCanvasLeft = true;
      this.showOverlay = true;
    } else if (canvas == "right") {
      this.showCanvasRight = true;
      this.showOverlay = true;
    }
  }

  closeCanvas() {
    if (this.showCanvasLeft) {
      this.showCanvasLeft = false;
      this.showOverlay = false;
    } else {
      this.showCanvasRight = false;
      this.showOverlay = false;
    }
  }

  openLoginModal() {
    this.userlogin = { document: "", password: "" };
    this.modalRef = this.modalService.show(this.login, {
      class: "modal-md",
      ignoreBackdropClick: true,
    });
  }

  loginUser() {
    this.loader = true;
    let body = {
      documento: this.userlogin.document + "",
      clave: this.userlogin.password,
    };

    /*let bodyToken = {
        "parametro1": this.singleton.parametro1,
        "parametro2": this.singleton.parametro2,
        "parametro3": "Web"
    }; */

    if (this.userlogin.document !== "" && this.userlogin.password !== "") {
      let token = localStorage.getItem("gtoken");
      //we get the user information
      this.provider.queryAuth("/confa/metodo11", body, 1, token).subscribe(
        (response:any) => {
          let result = response.json();

          if (result.documento != "") {
            let user = response.json();

            localStorage.setItem("user", JSON.stringify(user));

            let bodyToken = {
              parametro1: "" + Md5.hashStr(this.userlogin.document),
              parametro2: "" + Md5.hashStr(this.userlogin.password),
              parametro3: "Web",
            };

            this.provider.queryJson("/auth", bodyToken, 1).subscribe(
              (response:any) => {
                let result = response.json();
                this.loader = false;
                if (undefined !== result) {
                  let token = "Bearer " + result["token"];
                  localStorage.setItem("ptoken", token);
                  this.cookieService.set("ptoken", JSON.stringify(result));

                  this.singleton.loggedIn = true;
                  this.modalRef.hide();
                  this.logued = true;
                  this.getUser();
                  this.dataService.changeUser(user);
                  let mensaje =
                    "Si eres afiliado a Comfamiliar Risaralda o perteneces al Convenio Cafam Fuerzas Militares, para confirmar el valor a pagar envía el número de identificación del titular de la reserva o número de reserva al correo electrónico alojamiento@confa.co.";
                  swal({
                    title: "Ten en cuenta.",
                    text: mensaje,
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Continuar",
                  }).then((result) => {
                    if (result.value) {
                      this.welcomefunc();
                    }
                  });
                }
              },
              (err) => {
                localStorage.setItem("user", null);
                localStorage.setItem("token", null);
                this.loader = false;
                this.toastr.error(result.mensaje, "Error", {
                  enableHtml: true,
                  positionClass: "toast-top-center",
                });
              }
            );
          } else {
            this.loader = false;
            let message = "Credenciales incorrectas";
            this.toastr.error(message, "Error", {
              enableHtml: true,
              positionClass: "toast-top-center",
            });
          }
        },
        (err) => {
          this.loader = false;
          if (err.status == 401) {
            let message = "ALGO NO VA BIEN La sesión ha expirado";
            this.toastr.error(message, "Error", {
              enableHtml: true,
              positionClass: "toast-top-center",
            });
          }
          if (err.status == 503 || err.status == 0) {
            let message = "ALGO NO VA BIEN Parece que no tienes conexión";
            this.toastr.error(message, "Error", {
              enableHtml: true,
              positionClass: "toast-top-center",
            });
          }
          if (err.status == 500) {
            let message =
              "ALGO NO VA BIEN No es posible conectarse con confa en estos momentos";
            this.toastr.error(message, "Error", {
              enableHtml: true,
              positionClass: "toast-top-center",
            });
          }
          if (
            err.status != 500 &&
            err.status != 503 &&
            err.status != 0 &&
            err.status != 401
          ) {
            let message = "ALGO NO VA BIEN El usuario no existe";
            this.toastr.error(message, "Error", {
              enableHtml: true,
              positionClass: "toast-top-center",
            });
          }
        }
      );
    } else {
      let message = "Debes ingresar tu número de documento y contraseña";
      this.toastr.error(message, "Recuerda", {
        enableHtml: true,
        positionClass: "toast-top-center",
      });
      this.loader = false;
    }
  }

  forgotPassword() {
    this.messageModal = "Restrablece tu contraseña";
    this.viewPass = false;
  }

  validateModalDocument(modal) {
    this.disabled_inputs = false;
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
      fechaNacimiento: "",
      category: "",
      gender: "",
    };
    this.modalRef.hide();
    this.modalValidate = this.modalService.show(modal, {
      class: "modal-md",
      ignoreBackdropClick: true,
    });
  }

  Registry(modal) {
    this.modalRegistry = this.modalService.show(modal, {
      class: "modal-lg",
      ignoreBackdropClick: true,
    });
  }

  recoverPass() {
    this.loader = true;
    let body = {
      documento: this.userlogin["document"],
      sistema: "Portal Confa",
      linkMensaje: this.singleton.url + "recover",
      parametro: "e541f24f0b06368c9cfb418174699da5",
      remitente: "Portal Confa",
      asunto: "Recuperación de contraseña",
    };

    let token = "";

    if (this.userlogin["document"] != "") {
      this.provider.queryAuth("/confa/metodo14", body, 1, token).subscribe(
        (response:any) => {
          let result = response.json();
          this.loader = false;
          if (result.respuesta === "") {
            let mensaje =
              "Se han enviado los datos de recuperación al correo electrónico. ";
            this.toastr.success(mensaje, "Buen trabajo", {
              enableHtml: true,
              positionClass: "toast-top-center",
            });
            /*swal({
                    title: "Éxito",
                    text: mensaje,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonClass: "btn-success",
                     confirmButtonText: "Continuar"
                 });*/
            this.modalRef.hide();
          } else {
            this.toastr.error(
              "No existe un usuario registrado con este documento. ",
              "Lo sentimos",
              { enableHtml: true, positionClass: "toast-top-center" }
            );
          }
        },
        (err) => {
          if (err.status == 503) {
            this.toastr.error(
              "Parece que no tienes conexión. ",
              "Lo sentimos",
              { enableHtml: true, positionClass: "toast-top-center" }
            );
          }
        }
      );
    } else {
      this.toastr.error(
        "Debes especificar un número de documento. ",
        "Lo sentimos",
        { enableHtml: true, positionClass: "toast-top-center" }
      );
    }
  }

  validteDocument(modal) {
    if (this.userRegistry.document.length < 5) {
      this.toastr.error(
        "el número de documento debe tener al menos 5 caracteres.",
        "Lo sentimos",
        { enableHtml: true, positionClass: "toast-top-center" }
      );
      return;
    }

    let bodyAuth = {
      parametro1: this.singleton.parametro1,
      parametro2: this.singleton.parametro2,
      parametro3: "Web",
    };
    this.loader = true;
    this.provider.queryJson("/auth", bodyAuth, 1).subscribe(
      (response:any) => {
        let result = response.json();
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
                let result = response.json();

                let exist_user = result.usuario["existeUsuario"];

                if (result.usuario["primerNombre"] != "") {
                  this.disabled_inputs = true;
                } else {
                  this.disabled_inputs = false;
                }

                this.userRegistry = {
                  tipoDocumento: "",
                  document: this.userRegistry.document,
                  address: "",
                  phone: "",
                  cellphone: "",
                  email: "",
                  confirm_email: "",
                  password: "",
                  confirm_password: "",
                  first_name: result.usuario["primerNombre"],
                  second_name: result.usuario["segundoNombre"],
                  first_last_name: result.usuario["primerApellido"],
                  second_last_name: result.usuario["segundoApellido"],
                  accept_terms: false,
                  accept_habeas: false,
                  fechaNacimiento: result.usuario["fechaNacimiento"],
                  category: result.usuario["categoria"],
                  gender: result.usuario["sexo"],
                };

                this.loader = false;
                if (exist_user) {
                  this.toastr.error(
                    "Ya existe un usuario registrado con este número de documento.",
                    "Lo sentimos",
                    { enableHtml: true, positionClass: "toast-top-center" }
                  );
                  this.modalValidate.hide();
                } else {
                  this.modalValidate.hide();
                  this.Registry(modal);
                }
              },
              (err) => {
                if (err.status == 503) {
                  this.loader = false;
                  this.toastr.error(
                    "Parece que no tienes conexión",
                    "Lo sentimos",
                    { enableHtml: true, positionClass: "toast-top-center" }
                  );
                }
              }
            );
        }
      },
      (err) => {}
    );
  }

  register() {
    this.loader = true;
    let body = {
      sistema: "Portal Confa",
      linkMensaje: this.singleton.url + "confirm",
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
      this.loader = false;
    } else {
      if (this.userRegistry.email !== this.userRegistry.confirm_email) {
        errorMessage =
          "Recuerda que los campos email y confirmar email deben coincidir.";
        this.loader = false;
      } else {
        if (this.userRegistry.password !== this.userRegistry.confirm_password) {
          errorMessage =
            "Los campos 'Contraseña' y 'Confirmar contraseña' deben coincidir.";
          this.loader = false;
        } else {
          if (this.userRegistry.accept_habeas === false) {
            errorMessage =
              "Debes aceptar la Política de de tratamiento de datos.";
            this.loader = false;
          } else {
          }
        }
      }
    }

    if (errorMessage === "") {
      let bodyAuth = {
        parametro1: this.singleton.parametro1,
        parametro2: this.singleton.parametro2,
        parametro3: "Web",
      };

      this.provider.queryJson("/auth", bodyAuth, 1).subscribe((response:any) => {
        let result = response.json();
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
                let result = response.json();

                let exist_user = result.usuario["existeUsuario"];

                if (!exist_user) {
                  this.provider
                    .queryJson("/confa/metodo12", body, 1, token)
                    .subscribe(
                      (response:any) => {
                        let result = response.json();
                        this.loader = false;
                        if (result.respuesta === "") {
                          let mensaje =
                            "Te hemos enviado un correo de confirmación. Debes confirmar para poder ingresar, si no ves el correo en tu bandeja principal por favor revisa tu carpeta de SPAM, Gracias!.";
                          //this.toastr.success(mensaje, 'Buen trabajo', {enableHtml: true, positionClass: 'toast-bottom-right'});
                          this.modalRegistry.hide();
                          swal({
                            title: "Registro en proceso",
                            text: mensaje,
                            type: "success",
                            showCancelButton: false,
                            confirmButtonClass: "btn-success",
                            confirmButtonText: "Continuar",
                          });
                        } else {
                          this.loader = false;
                          this.toastr.error(result.respuesta, "Lo sentimos", {
                            enableHtml: true,
                            positionClass: "toast-top-center",
                          });
                        }
                      },
                      (err) => {
                        if (err.status == 503) {
                          this.loader = false;
                          this.toastr.error(
                            "Parece que no tienes conexión",
                            "Lo sentimos",
                            {
                              enableHtml: true,
                              positionClass: "toast-top-center",
                            }
                          );
                        }
                      }
                    );
                } else {
                  this.loader = false;
                  this.toastr.error(
                    "Ya existe un usuario registrado con este número de documento.",
                    "Lo sentimos",
                    { enableHtml: true, positionClass: "toast-top-center" }
                  );
                  //this.presentModal('ALGO NO VA BIEN', 'Ya existe un usuario registrado con este número de documento', true);
                }
              },
              (err) => {
                if (err.status == 503) {
                  console.log("Parece que no tienes conexión");
                  this.loader = false;
                }
              }
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

  closelogin() {
    this.viewPass = true;
    this.modalRef.hide();
  }

  closeregistrar() {
    this.viewPass = true;
    this.ViewRegisterForm = true;
    this.modalRegistry.hide();
  }

  validateDocument() {
    let values = /^[0-9]+$/;
    if (
      !values.test(this.userlogin.document) ||
      this.userlogin.document.length > 15
    ) {
      // this.userlogin.document = "";
      let text = this.userlogin["document"];
      this.userlogin["document"] = text.slice(0, -1);
    }
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

  onActivate(event: any) {
    document.body.scrollTop = 0;
  }
}
