import { Component, OnInit, Input } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  UntypedFormBuilder,
} from "@angular/forms";
//import { AuthenticationService } from '/services/authentication.service';
import { first } from "rxjs/operators";
//import { User } from '../../interfaces/user.interface';
import { Md5 } from "ts-md5";
import { UtilitiesService } from "src/app/services/general/utilities.service";
import { environment } from "src/environments/environment";
import { CookieService } from "ngx-cookie-service";
import * as globals from "../../../globals";
import { IMyDpOptions } from "mydatepicker";
import * as environments from "src/environments/environment";
import { UserService } from "src/app/services/user/user.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-form-register",
  templateUrl: "./form-register.component.html",
  styleUrls: ["./form-register.component.scss"],
})
export class FormRegisterComponent implements OnInit {
  public birthdayFieldLogin = globals.birthdayFieldLogin;
  formRegister: UntypedFormGroup;
  submitted: boolean = false;
  tpDoc: String = "";

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

  //Options date start dateOptionsFinish
  public dateOptionsInit: IMyDpOptions = {
    // other options...
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
    //minYear: this.date.getFullYear(),
    //maxYear: this.date.getFullYear() + 2,
    todayBtnTxt: "Hoy",
    //disableUntil: this.disabledUntil,
    disableDays: this.disabledDays,
    disableSince: this.disableSince,
    openSelectorOnInputClick: true,
    editableDateField: false,
    inline: false,
    height: "44px",
  };
  public siteKey = environments._site.recaptcha.secretkey;
  //@Input() user: User;

  constructor(
    //private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService,
    private formBuilder: UntypedFormBuilder,
    private ut: UtilitiesService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit() {
    this.formRegister = this.formBuilder.group({
      tpDoc: ["", Validators.required],
      firstName: [
        "",
        [Validators.required, Validators.pattern("[A-Za-zá-úÁ-Ú ]*")],
      ],
      secondName: ["", [Validators.pattern("[A-Za-zá-úÁ-Ú ]*")]],
      firstLastName: [
        "",
        [Validators.required, Validators.pattern("[A-Za-zá-úÁ-Ú ]*")],
      ],
      secondLastName: ["", Validators.pattern("[A-Za-zá-úÁ-Ú ]*")],
      document: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
          Validators.pattern("^[0-9]+"),
        ],
      ],
      email: [
        "",
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
        "",
        [
          Validators.minLength(6),
          Validators.maxLength(15),
          Validators.pattern("^[0-9]+"),
        ],
      ],
      celular: [
        "",
        [
          Validators.minLength(6),
          Validators.maxLength(15),
          Validators.pattern("^[0-9]+"),
        ],
      ],
      birthday: [
        "",
        [
          //this.ut.convertDateObject(DEMODATA.birthday),
          Validators.compose([Validators.required]),
        ],
      ],
    });
  }
  get f() {
    return this.formRegister.controls;
  }
  get getTpDoc() {
    return (
      this.formRegister.get("tpDoc").invalid &&
      this.formRegister.get("tpDoc").touched
    );
  }

  close() {
    this.cookieService.delete("gtoken");
    this.formRegister.get("firstName").setValue("");
    this.formRegister.get("secondName").setValue("");
    this.formRegister.get("firstLastName").setValue("");
    this.formRegister.get("secondLastName").setValue("");
  }
  equalsEmail(control: UntypedFormControl): { [s: string]: boolean } {
    let formRegister: any = this;
    if (control.value !== formRegister.controls["email"].value) {
      return {
        equalsemail: true,
      };
    }
    return null;
  }

  equalsPassword(control: UntypedFormControl): { [s: string]: boolean } {
    let formRegister: any = this;
    if (control.value !== formRegister.controls["password"].value) {
      return {
        equalspassword: true,
      };
    }
    return null;
  }

  capturar(value) {
    this.formRegister.get("tpDoc").setValue(value);
    this.tpDoc = value;
  }
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.formRegister.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  onSubmit() {
    if (this.formRegister.invalid) {
      Object.keys(this.f).forEach((controlName) => {
        const control = this.f[controlName];
        control.markAsTouched();
      });
      return;
    } else {
      let user = this.generateUser(this.f);
      this.userService.guardarSuperUsuario(user).subscribe((res: any) => {
        let result = res.json();
        if (result.estado == "OK") {
          this.toastr.success(
            "Ya casi terminamos.",
            "Ahora, debes acceder para programar tu cita de Vacunación contra covid-19",
            {
              enableHtml: true,
              positionClass: "toast-middle-right",
              timeOut: 6000,
            }
          );
          this.router.navigate(["/vacunasCovid"]);
        } else {
          this.showErrors(
            "Error al registrar usuario, Por favor dirígete a nuestros puntos de atención al cliente en el Centro Médico Confa de La 50 (Calle 50 Cra. 25) o en el Centro Médico San Marcel (Av. Alberto Mendoza  Cr 30 # 93-25)."
          );
          this.router.navigate(["/vacunasCovid"]);
          console.log("error");
        }
      });
    }
  }
  private generateUser(f: any) {
    let nuevoRegistro = {
      tipoDocumento: f.tpDoc.value,
      documento: f.document.value,
      nombre: f.firstName.value,
      segundoNombre: f.secondName.value,
      primerApellido: f.firstLastName.value,
      segundoApellido: f.secondLastName.value,
      telefonoResidencia: f.telefono.value,
      telefonoCelular: f.celular.value,
      correo: f.email.value,
      fechaNacimiento: f.birthday.value.formatted,
      sexo: "",
      direccion: "",
    };

    return nuevoRegistro;
  }

  /**
   * Errors
   */
  showErrors(message) {
    this.ut.showErrorsModal(true, message);
  }
}
