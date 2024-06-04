import { Component, OnInit, ViewChild } from "@angular/core";
import { SingletonService } from "../../singleton.service";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from "@angular/router";
import { DataService } from "../../data.service";
import { TranslateService } from "@ngx-translate/core";
import { ApirestService } from "../../apirest.service";
import { ToastrService } from "ngx-toastr";
import { RestProvider } from "../../providers/rest/rest";

import { Md5 } from "ts-md5/dist/md5";
import swal from "sweetalert2";

import { AuthService } from "src/app/services/auth/auth.service";
import { CookieService } from "ngx-cookie-service";
import { first } from "rxjs/operators";
import { UtilitiesService } from "../../services/general/utilities.service";

declare var $;

@Component({
  selector: "app-layout-header",
  templateUrl: "./layout-header.component.html",
  styleUrls: ["./layout-header.component.scss"],
})
export class LayoutHeaderComponent implements OnInit {
  public to_appointments = "/salud";
  public to_accommodation = "";

  public ViewRegisterForm = true;

  public user = {};
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
  public servicio_alojamiento = "";

  //Variables para el login
  public userlogin = { document: "", password: "" };

  public logued = false;
  public loader = false;
  public welcome;
  public menu = false;

  public showCanvasLeft = false;
  public showCanvasRight = false;

  public messageModal = "Ingresa para disfrutar de todos nuestros servicios";
  public viewPass = true;

  public showOverlay = false;
  public disabled_inputs = false;

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
  };

  modalRef: BsModalRef;
  modalRegistry: BsModalRef;
  modalValidate: BsModalRef;
  public showMenu = false;
  public showMenuAuthentications = false;

  @ViewChild("login", { static: false }) login;
  constructor(
    public singleton: SingletonService,
    private modalService: BsModalService,
    private router: Router,
    public dataService: DataService,
    private translate: TranslateService,
    private auth: AuthService,
    public service: ApirestService,
    private toastr: ToastrService,
    public provider: RestProvider,
    private cookieService: CookieService,
    private ut: UtilitiesService
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
    this.servicio_alojamiento = this.singleton.portal + "/personas/alojamiento/";
    this.servicio_salud = this.singleton.portal + "/personas/salud/";
    this.contacto = this.singleton.portal + "/personas/contacto/";
    this.viveconfa = this.singleton.portal + "/personas/servicios-en-linea/";
  }

  ngOnInit() {
    this.generateGToken();
    if (this.router.url === "/") {
      window.location.assign(this.viveconfa);
    }

    this.dataService.user.subscribe((data:any) => {
      this.getUser();
    });
  }

  generateGToken() {
    let bodyToken = {
      parametro1: this.singleton.parametro1,
      parametro2: this.singleton.parametro2,
      parametro3: "Web",
    };

    this.provider.queryJson("/auth", bodyToken, 1).subscribe((response:any) => {
      let result = response;

      if (undefined !== result) {
        let token: string = "Bearer " + result.token;
        localStorage.setItem("gtoken", token);
      }
    });
  }

  /**
   *  It gets the user from the local storage
   **/
  getUser() {
    this.loadUserInfo().then(() => {
      this.user = JSON.parse(localStorage.getItem("user"));

      if (this.user && this.ut.validateToken) {
        this.logued = true;
      } else {
        this.logued = false;
      }

      if (!this.ut.validateToken && this.ut.message === "02--El Token Expiró") {
        this.ut.toggleSplashscreen(true);

        setTimeout(() => {
          this.ut.toggleSplashscreen(false);
          $(".btn-modal-token-expired").click();
        }, 1000);
      }

      this.translate.use("es");
    });
  }

  private loadUserInfo() {
    let tokenCookie =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : null;

    if (tokenCookie) {
      return new Promise<void>((resolve, reject) => {
        this.provider
          .validateToken(tokenCookie["token"])
          .pipe(first())
          .subscribe((response: any) => {
            let result = response;
            // console.log(result);

            if (result.valido && result.tipo == "E") {
              this.ut.validateToken = true;

              this.provider
                .login(tokenCookie["token"])
                .pipe(first())
                .subscribe((response:any) => {
                  let user = response;
                  let token = "Bearer " + tokenCookie["token"];
                  localStorage.setItem("ptoken", token);
                  localStorage.setItem("user", JSON.stringify(user));
                  resolve();
                });
            } else {
              this.ut.validateToken = false;
              this.ut.message = result.mensaje;
              resolve();
            }
          });
      });
    } else {
      return new Promise<void>((resolve, reject) => {
        this.ut.validateToken = false;
        this.ut.message = null;
        resolve();
      });
    }
  }

  openLoginModal() {
    this.menu = false;
    this.auth.openLoginModal(true);
  }

  openServices() {
    this.showMenu = !this.showMenu;
    this.showMenuAuthentications = false;
  }

  openAuthUser() {
    this.showMenuAuthentications = !this.showMenuAuthentications;
    this.showMenu = false;
  }

  openMenu(option) {
    if (option == true) {
      this.menu = false;
    } else {
      this.menu = true;
    }
  }

  closeMenu() {
    if (this.menu) {
      this.menu = false;
    }
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

  /**
   * Logout from api and redirect to login
   */
  // logout() {
  //   this.auth.closeSession(true);
  // }

  logout() {
    this.ut.toggleSplashscreen(true);
    setTimeout(() => {
      // this.cookieService.deleteAll();
      this.ut.logout();
      this.ut.toggleSplashscreen(false);
      window.location.reload();
    }, 500);
  }

  async welcomefunc(login: boolean = false) {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user["sexo"] == "M") {
      this.welcome =
        "Bienvenido " + user.primerNombre + " " + user.segundoNombre + "";
    } else if (user["sexo"] == "F") {
      this.welcome =
        "Bienvenida " + user.primerNombre + " " + user.segundoNombre + "";
    } else {
      this.welcome =
        "Bienvenido " + user.primerNombre + " " + user.segundoNombre + "";
    }

    this.showOverlay = true;
    await this.sleep(5000);
    if (login == true) {
      this.router.navigate(["/salud"]);
      location.reload();
    }
    this.showOverlay = false;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
