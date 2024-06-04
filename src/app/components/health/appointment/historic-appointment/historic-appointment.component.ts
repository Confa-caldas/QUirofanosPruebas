import { Component, OnInit, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import {
  PageScrollConfig,
  PageScrollService,
  PageScrollInstance,
} from "ngx-page-scroll-core";
import { AppoinmentService } from "src/app/services/appoinment/appoinment.service";
import { UtilitiesService } from "src/app/services/general/utilities.service";
import { Router } from "@angular/router";
import * as globals from "../../../../globals";
@Component({
  selector: "app-historic-appointment",
  templateUrl: "./historic-appointment.component.html",
  styleUrls: ["./historic-appointment.component.scss"],
})
export class HistoricAppointmentComponent implements OnInit {
  public historicAppointments = [];
  public main_health = "/salud/";
  public main_appointments = "/salud/citas/";
  public scheduleAppointmentLink = "/salud/citas/agendarCita";
  public historialCitas = globals.historialCitas;
  public load = true;
  constructor(
    private pageScrollService: PageScrollService,
    private appoinmentService: AppoinmentService,
    private ut: UtilitiesService,
    private router: Router,
    @Inject(DOCUMENT) private doc: any
  ) {}

  ngOnInit() {
    this.ut.toggleSplashscreen(true);
    this.getHistoricAppointments();
  }


  scrollTo(_destination: string) {
    const pageScrollInstance: PageScrollInstance = this.pageScrollService.create({
      document: this.doc,
      scrollTarget: _destination,
    });
    this.pageScrollService.start(pageScrollInstance);
  }


  getHistoricAppointments() {
    let dataSession = this.ut.getLocalSession();

    let data = {
      documento: dataSession["documento"],
      adicional: dataSession["adicional"],
    };
    this.appoinmentService.getHistoricAppointment(data).subscribe(
      (success) => {
        let result = success.json();
        this.ut.toggleSplashscreen(false);
        this.load = false;
        if (result.citasUsuario) {
          this.historicAppointments = result.citasUsuario;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  viewDetails(id) {
    this.router.navigate(["/salud/citas/resumen-pago"], {
      queryParams: { e541f24f: "" + id, show: "true" },
    });
  }
}
