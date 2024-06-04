import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { SearchComponent } from "./search/search.component";
import { ConfirmComponent } from "./confirm/confirm.component";
import { RecoverComponent } from "./recover/recover.component";
import { HomeComponent } from "./components/home/home.component";

const routes: Routes = [
  { path: "buscador", component: SearchComponent },
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "", component: HomeComponent },
      { path: "confirm/:to", component: ConfirmComponent },
      { path: "recover", component: RecoverComponent },

 
      {
        path: "quirofanos",
        //component: HealthComponent
        loadChildren: () => import('./components/health/health.module').then(m => m.HealthModule)
        //loadChildren: "./components/health/health.module#HealthModule",
        //loadChildren: 'com/views/themes/main/theme.module#ThemeModule',
        //canActivate: [AuthGuard]
      },
      { path: "**", redirectTo: "quirofanos", pathMatch: "full" },
    ],
  },

  //{path: 'salud', component: HealthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
