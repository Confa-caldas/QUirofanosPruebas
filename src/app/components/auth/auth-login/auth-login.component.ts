import { Component, OnInit, ViewChild,ViewEncapsulation } from "@angular/core";
import { SingletonService } from "../../../singleton.service";
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
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
import { CookieService } from "ngx-cookie-service";

declare var $;
@Component({
  selector: "app-auth-login",
  templateUrl: "./auth-login.component.html",
  styleUrls: ["./auth-login.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AuthLoginComponent implements OnInit {
  //Variables para el login
  public userlogin = { document: "", password: "" };
  modalRef: BsModalRef;
  
  @ViewChild("login", { static: false }) login;

  public messageModal = "Ingresa para disfrutar de todos nuestros servicios";
  public viewPass = true;
  public loader = false;
  private unsubscribes: Subscription[] = [];

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
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    //Function to cancel and pay appointment
    let openModal = this.auth.showHideloginModal.subscribe((res) => {
      if (res) {
        this.openLoginModal();
      }
    });

    let closeSession = this.auth._closeSession.subscribe((res) => {
      if (res) {
        this.logout();
      }
    });

    this.unsubscribes.push(openModal, closeSession);
  }

  ngOnDestroy() {
    this.unsubscribes.forEach((sb) => sb.unsubscribe());
  }

  openLoginModal() {
    this.userlogin = { document: "", password: "" };
    this.modalRef = this.modalService.show(this.login, {
      class: "modal-md",
      ignoreBackdropClick: true,
    });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
      this.userlogin = { document: "", password: "" };
    }

    this.messageModal = "Ingresa para disfrutar de todos nuestros servicios";
    this.viewPass = true;
  }

  loginUser() {
    if (!this.viewPass) {
      this.recoverPass();
      return;
    }
    this.ut.toggleSplashscreen(true);
    this.loader = true;
    let body = {
      documento: this.userlogin.document + "",
      clave: this.userlogin.password, 
    };

    if (this.userlogin.document !== "" && this.userlogin.password !== "") {
      let token = localStorage.getItem("gtoken");
      //we get the user information
      this.provider.queryAuth("/confa/metodo11", body, 1, token).subscribe(
        (response:any) => {
          this.ut.toggleSplashscreen(false);
          let result = response;
          this.loader = false;
          if (result.documento != "") {
            let user = response.json();
            localStorage.removeItem("user_agreements");
            localStorage.removeItem("user_health");

            localStorage.setItem("user", JSON.stringify(user));

            let bodyToken = {
              parametro1: "" + Md5.hashStr(this.userlogin.document),
              parametro2: "" + Md5.hashStr(this.userlogin.password),
            };

            let message = `Bienvenido ${user.primerNombre} ${user.segundoNombre} ${user.primerApellido} ${user.segundoApellido}`;

            setTimeout(() => {
              this.ut.toggleSplashscreen(true, message);
            }, 200);

            this.provider.queryJson("/auth", bodyToken, 1).subscribe(
              (response) => {
                let result = response;

                if (undefined !== result) {
                  let token = "Bearer " + result["token"];
                  localStorage.setItem("ptoken", token);
                  this.cookieService.set("ptoken", JSON.stringify(result));

                  this.singleton.loggedIn = true;
                  this.modalRef.hide();

                  this.dataService.changeUser(user);
                  let mensaje =
                    "Si eres afiliado a Comfamiliar Risaralda o perteneces al Convenio Cafam Fuerzas Militares, para confirmar el valor a pagar envía el número de identificación del titular de la reserva o número de reserva al correo electrónico alojamiento@confa.co.";
               

                  setTimeout(() => {
                    this.ut.toggleSplashscreen(false);
                  }, 1000);
                  if (this.router.url.search("salud") > 0) {
                    this.router.navigate(["/salud"]);
                  }
                }
              },
              (err) => {
                localStorage.setItem("user", null);
                localStorage.setItem("token", null);
                this.ut.toggleSplashscreen(false);
                this.toastr.error(result.mensaje, "Error", {
                  enableHtml: true,
                  positionClass: "toast-top-center",
                });
              }
            );
          } else {
            this.ut.toggleSplashscreen(false);
            let message = "Credenciales incorrectas";
            this.toastr.error(message, 'Error', {
              enableHtml: true,
              positionClass: 'toast-top-center',
            });
          }
        },
        (err) => {
          this.ut.toggleSplashscreen(false);
          this.loader = false;
          if (err.status == 401) {
            let message = "ALGO NO VA BIEN La sesión ha expirado";
            this.toastr.error(message, "Error", {
              enableHtml: true,
              positionClass: 'toast-top-center',
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
      this.ut.toggleSplashscreen(false);
      this.loader = false;
    }
  }

  async logout() {
    this.ut.toggleSplashscreen(true);

    if (this.router.url.search("salud") > 0) {
      this.router.navigate(["/salud"]);
    }

    if (this.router.url.search("alojamiento") > 0) {
      this.router.navigate(["/alojamiento"]);
    }

    localStorage.removeItem("gtoken");
    localStorage.removeItem("user");
    localStorage.removeItem("ptoken");
    this.cookieService.delete("ptoken");
    this.cookieService.deleteAll();
    localStorage.removeItem("htoken");
    localStorage.removeItem("user_health");
    localStorage.removeItem("user_agreements");
    this.singleton.loggedIn = false;
    this.ut.toggleSplashscreen(false);
    this.dataService.changeUser(null);
    this.loader = false;
  }

  recoverPass() {
    this.loader = true;
    this.ut.toggleSplashscreen(true);
    let body = {
      documento: this.userlogin["document"],
      sistema: "Portal Confa",
      linkMensaje: this.singleton.url + "/recover",
      parametro: "e541f24f0b06368c9cfb418174699da5",
      remitente: "Portal Confa",
      asunto: "Recuperación de contraseña",
    };

    let token = "";

    if (this.userlogin["document"] != "") {
      let bodyUser = {
        documento: this.userlogin["document"],
      };
      let email: string;

      this.provider
        .queryAuth("/confa/metodo2", bodyUser, 1, token)
        .subscribe((response) => {
          let result = response
          email = this.indicationEmail(result["correo"]);
        });

      this.provider.queryAuth("/confa/metodo14", body, 1, token).subscribe(
        (response:any) => {
          let result = response;
          this.loader = false;
          this.ut.toggleSplashscreen(false);
          if (result.respuesta === "") {
            let mensaje = `Se han enviado los datos de recuperación al correo electrónico, si no ve el correo en su bandeja principal por favor revise su carpeta de SPAM, Gracias!. ${email}`;
            this.toastr.success(mensaje, "Buen trabajo", {
              enableHtml: true,
              positionClass: "toast-top-center",
            });

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
      this.ut.toggleSplashscreen(false);
      this.loader = false;
      this.toastr.error(
        "Debes especificar un número de documento. ",
        "Lo sentimos",
        { enableHtml: true, positionClass: "toast-top-center" }
      );
    }
  }

  forgotPassword() {
    this.messageModal = "Restrablece tu contraseña";
    this.userlogin = { document: "", password: "" };
    this.viewPass = false;
  }

  showLogin() {
    this.messageModal = "Ingresa para disfrutar de todos nuestros servicios";
    this.userlogin = { document: "", password: "" };
    this.viewPass = true;
  }

  showValidateDocument() {
    this.closeModal();

    this.auth.openModalValidateDocument(true);
  }

  validateDocumentregister() {
    let values = /^[0-9]+$/;
    if (
      !values.test(this.userlogin.document) ||
      this.userlogin.document.length > 15
    ) {
      // this.userlogin.document = "";
      let text = this.userlogin.document;
      this.userlogin.document = text.slice(0, -1);
    }
  }

  indicationEmail(value: string): string {
    let emailHide = "";
    let email = value.split("@");
    let part1 = email[0];
    let part2 = email[1];
    let part1Show = part1.slice(0, 2);

    for (let i = 2; i < part1.length; i++) {
      emailHide += "*";
    }
    let newEmail = part1Show + emailHide + "@" + part2;
    return newEmail;
  }
  openModal() {
    $(".btn-politicas").click();
  }
}
