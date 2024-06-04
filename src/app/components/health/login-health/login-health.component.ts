import { Component, OnInit, EventEmitter, Output, OnDestroy } from "@angular/core";
import { IMyDpOptions } from "mydatepicker";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import * as environments from "src/environments/environment";
import * as _globals from "src/app/globals";
import { DocumentTypeService } from "src/app/services/document/document-type.service";
import { UtilitiesService } from "src/app/services/general/utilities.service";
import { UserService } from "src/app/services/user/user.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { TermsService } from "src/app/services/user/terms.service";
import * as globals from "../../../globals";
import { DataService } from "src/app/data.service";
import { CookieService } from "ngx-cookie-service";
import { RestProvider } from "../../../providers/rest/rest";
import { first } from "rxjs/operators";
import { QuirofanosService } from "src/app/services/quirofanos/quirofanos.service";
declare var $: any;

@Component({
  selector: "app-login-health",
  templateUrl: "./login-health.component.html",
  styleUrls: ["./login-health.component.scss"],
})
export class LoginHealthComponent implements OnInit, OnDestroy {
  public documentFieldLogin = globals.documentFieldLogin;
  public documentTypeFieldLogin = globals.documentTypeFieldLogin;
  public birthdayFieldLogin = globals.birthdayFieldLogin;
  public form: string;
  private unsubscribes: Subscription[] = [];

  public date = new Date();
  public initDate = {
    year: this.date.getFullYear(),
    month: this.date.getMonth() + 1,
    day: this.date.getDate(),
  };

  public disabledDays = [];
  public disabledUntil = {
    year: this.date.getFullYear(),
    month: this.date.getMonth() + 1,
    day: this.date.getDate(),
  };
  public disableSince = { year: this.date.getFullYear() + 1, month: 2, day: 1 };
  public disableUnitilFinish = this.initDate;

  public dateOptionsInit: IMyDpOptions = {
    dayLabels: {
      su: "Do",
      mo: "Lu",
      tu: "Ma",
      we: "Mi",
      th: "Ju",
      fr: "Vi",
      sa: "Sa",
    },
    monthLabels: {
      1: "Ene",
      2: "Feb",
      3: "Mar",
      4: "Abr",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Ago",
      9: "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dic",
    },
    dateFormat: "yyyy-mm-dd",
    firstDayOfWeek: "mo",
    sunHighlight: true,
    showTodayBtn: true,
    yearSelector: true,
    todayBtnTxt: "Hoy",
    disableDays: this.disabledDays,
    disableSince: this.disableSince,
    openSelectorOnInputClick: true,
    editableDateField: false,
    inline: false,
    height: "44px",
  };

  public siteKey = environments._site.recaptcha.secretkey;

  public aFormGroup: UntypedFormGroup;

  public user: any;
  public loggedin: any = {
    status: false,
    document: "",
    documentType: "",
    birthday: "",
  };

  public documentType = [];

  @Output() loaderEvent = new EventEmitter<boolean>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private ut: UtilitiesService,
    private userService: UserService,
    private terms: TermsService,
    private documentTypeService: DocumentTypeService,
    private router: Router,
    public dataService: DataService,
    private cookieService: CookieService,
    private provider: RestProvider,
    private quirofanoService: QuirofanosService
  ) {
    this.documentType = this.documentTypeService.getAll();
  }

  ngOnInit() {
    this.form = "0";
    localStorage.setItem("form", this.form);
    this.dataService.user.subscribe((data) => {
      this.checkIfLogin();
    });

    this.checkIfLogin();
  }

  ngOnDestroy() {
    this.unsubscribes.forEach((sb) => sb.unsubscribe());
  }

  checkIfLogin() {
    this.loadUserInfo().then(() => {
      this.user = this.userService.getSessionUser();

      if (this.user && this.ut.validateToken) {
        this.loggedin = {
          status: true,
          document: this.user.documento,
          documentType: this.user.tipoDocumento,
          birthday: this.user.fechaNacimiento,
        };
      } else {
        this.loggedin = {
          status: false,
          document: "",
          documentType: "",
          birthday: "",
        };
      }
      this.createForm(this.loggedin);
    });
    this.createForm(this.loggedin);
  }

  private loadUserInfo() {
    let token =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : null;

    if (token) {
      return new Promise<void>((resolve) => {
        this.provider
          .login(token["token"])
          .pipe(first())
          .subscribe((response) => {
            let user = response;
            localStorage.setItem("user", JSON.stringify(user));
            resolve();
          });
      });
    } else {
      return new Promise<void>((resolve) => {
        resolve();
      });
    }
  }

  createForm(data: any) {
    this.aFormGroup = this.formBuilder.group({
      document: [
        data.document,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ]),
      ],
      documentType: [
        data.documentType,
        Validators.compose([Validators.required]),
      ],
      birthday: [
        data.birthday ? this.ut.convertDateObject(data.birthday) : "",
        Validators.compose([Validators.required]),
      ],
    });
  }

  submit() {
    const controls = this.aFormGroup.controls;

    if (this.aFormGroup.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    let data = {
      documento: controls["document"].value.toString(),
      tipoDocumento: controls["documentType"].value,
      fechaNacimiento: this.ut.convertDateFormat(
        controls["birthday"].value.date,
        "YYYY-MM-DD"
      ),
    };

    this.ut.toggleSplashscreen(true);

    const checkUserSubs = this.userService
      .checkIfUserHaveServiceHealth(data)
      .subscribe((res) => {
        let result = res;
        if (result.estado == "OK") {
          localStorage.setItem("gtoken", result.mensaje);
          const getDatosSubs = this.userService
            .getdatos(data)
            .subscribe((res) => {
              let result = res;
              if (result.respuesta.estado == "OK") {
                let body = {
                  numero_documento: data.documento,
                };
                this.quirofanoService
                  .getRadicacionRegistrada(body)
                  .subscribe((res) => {
                    let resultadoRadicacion = res;
                    var info = resultadoRadicacion.secuencia.replace(
                      "\n",
                      "<br/>",
                    );
                  
                    if (info == "") {
                      let adicional = result.unidadesConvenios.length - 1;
                      data["adicional"] =
                        result.unidadesConvenios[adicional].adicional;
                      data["user"] =
                        result.unidadesConvenios[adicional].nombreUsuario;
                      let agreements = [];
                      for (
                        let i = 0;
                        i < result.unidadesConvenios.length;
                        i++
                      ) {
                        agreements.push({
                          convenio: result.unidadesConvenios[i].convenioId,
                          value: result.unidadesConvenios[i].nombre,
                          plan: result.unidadesConvenios[i].plan,
                        });
                      }
                      this.ut.setLocalSession(agreements, "user_agreements");

                      if (this.user) {
                        let dataUserUpdate = {
                          documento: data.documento,
                          celular: this.user.celular,
                          direccion: this.user.direccion,
                          fechaNacimiento: data.fechaNacimiento,
                          tipoDocumento: data.tipoDocumento,
                          telefono: this.user.telefono,
                          genero: this.user.sexo,
                        };
                        const userUpdateSubs = this.userService
                          .updateDataUser(dataUserUpdate)
                          .subscribe((resUpd: any) => {
                            let resultUpd = resUpd;

                            if (resultUpd.respuesta) {
                              this.userService.updatedSessionUser(
                                dataUserUpdate
                              );
                              this.validationUserSuccess(data, result);
                            }
                          });

                        this.unsubscribes.push(userUpdateSubs);
                      } else {
                        this.validationUserSuccess(data, result);
                      }
                    } else {
                      this.showConfirm(
                        "Actualmente ya cuentas con una o varias radicaciones de cirugia",
                        info.replace('<table', '<table class="table table-striped"'),
                        "¿Deseas radicar otra cirugia?"
                      );
                      this.ut.toggleSplashscreen(false);
                      const response = this.ut._responseModalConfirm.subscribe(
                        (res) => {
                          if (res) {
                            let adicional = result.unidadesConvenios.length - 1;
                            data["adicional"] =
                              result.unidadesConvenios[adicional].adicional;
                            data["user"] =
                              result.unidadesConvenios[adicional].nombreUsuario;
                            let agreements = [];
                            for (
                              let i = 0;
                              i < result.unidadesConvenios.length;
                              i++
                            ) {
                              agreements.push({
                                convenio:
                                  result.unidadesConvenios[i].convenioId,
                                value: result.unidadesConvenios[i].nombre,
                                plan: result.unidadesConvenios[i].plan,
                              });
                            }
                            this.ut.setLocalSession(
                              agreements,
                              "user_agreements"
                            );

                            if (this.user) {
                              let dataUserUpdate = {
                                documento: data.documento,
                                celular: this.user.celular,
                                direccion: this.user.direccion,
                                fechaNacimiento: data.fechaNacimiento,
                                tipoDocumento: data.tipoDocumento,
                                telefono: this.user.telefono,
                                genero: this.user.sexo,
                              };
                              const userUpdateSubs = this.userService
                                .updateDataUser(dataUserUpdate)
                                .subscribe((resUpd: any) => {
                                  let resultUpd = resUpd;

                                  if (resultUpd.respuesta) {
                                    this.userService.updatedSessionUser(
                                      dataUserUpdate
                                    );
                                    this.validationUserSuccess(data, result);
                                  }
                                });

                              this.unsubscribes.push(userUpdateSubs);
                            } else {
                              this.validationUserSuccess(data, result);
                            }
                          } else {
                            console.log(res);
                          }
                          response.unsubscribe();
                        }
                      );
                    }
                  });
              } else {
                this.showErrors("Usuario no se encuentra habilitado");
                this.ut.toggleSplashscreen(false);
              }
            });
        } else {
          this.showErrors(
            "Actualmente no contamos con tu información en nuestra base de datos. Te invitamos a registrarte para poder acceder a solicitar tu cita de Vacunación contra covid-19"
          );
          this.ut.toggleSplashscreen(false);
        }
      });

    this.unsubscribes.push(checkUserSubs);
  }

  validationUserSuccess(data: any, result: any) {
    this.ut.toggleSplashscreen(false);
    this.terms.callTerms(true);

    const accepTermsSubs = this.terms._acceptTerms.subscribe((res) => {
      if (res) {
        this.userService.createSessionUser(data, "health");
        this.ut.setLocalSession(result.respuesta.mensaje, "htoken");
        this.router.navigate([_globals.main_appointments]);
      }
    });

    this.unsubscribes.push(accepTermsSubs);
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.aFormGroup.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  showErrors(message: string) {
    this.ut.showErrorsModal(true, message);
  }

  showConfirm(tittle: string, message: string, message2: string) {
    this.ut.showConfirmModal(true, tittle, message, message2);
  }

  openModal() {
    $(".btn-politicas").click();
  }
}
