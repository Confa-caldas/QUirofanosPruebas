import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HealthComponent } from "./health.component";
import { MainHealthComponent } from "./main-health/main-health.component";
import { AppointmentComponent } from "./appointment/appointment/appointment.component";
import { FormRegisterComponent } from "./form-register/form-register.component";
import { HealthAuthGuard } from "../../guards/health/health-auth.guard";
import { OperatingRoomComponent } from "./appointment/operating-room/operating-room.component";

const routes: Routes = [
  {
    path: "",
    //loadChildren: 'app/views/themes/main/theme.module#ThemeModule',
    component: HealthComponent,
    children: [
      { path: "", component: MainHealthComponent },
      {
        path: "citas",
        component: AppointmentComponent,
        canActivate: [HealthAuthGuard],
      },
      // {
      //   path: "citas/historico",
      //   component: HistoricAppointmentComponent,
      //   canActivate: [HealthAuthGuard],
      // },
      // {
      //   path: "citas/agendar",
      //   component: OperatingRoomComponent,
      //   // component: ScheduleAppointmentComponent,
      //   canActivate: [HealthAuthGuard],
      // },
      {
        path: "citas/agendarCita",
        component: OperatingRoomComponent,
        // component: ScheduleAppointmentComponent,
        canActivate: [HealthAuthGuard],
      },
      // {
      //   path: "citas/resumen-pago",
      //   component: PaymentAppointmentSumaryComponent,
      //   canActivate: [HealthAuthGuard],
      // },
      {
        path: "form",
        component: FormRegisterComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class HealthRoutingModule {}
