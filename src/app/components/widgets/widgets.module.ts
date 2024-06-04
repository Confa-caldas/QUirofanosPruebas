import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { WelcomeComponent } from "./welcome/welcome.component";
import { TranslateModule } from "@ngx-translate/core";
import { TabsLinksComponent } from "./tabs-links/tabs-links.component";
import { SplashscreenComponent } from "./splashscreen/splashscreen.component";
import { ErrorsComponent } from "./errors/errors.component";
import { ConfirmComponent } from "./confirm/confirm.component";
import { OnbdHealthComponent } from './onboardings/onbd-health/onbd-health.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OnbdAlojamientoComponent } from './onboardings/onbd-alojamiento/onbd-alojamiento.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild(),
    CarouselModule.forRoot(),
  ],
  declarations: [
    WelcomeComponent,
    TabsLinksComponent,
    SplashscreenComponent,
    ErrorsComponent,
    ConfirmComponent,
    OnbdHealthComponent,
    OnbdAlojamientoComponent,

  ],
  exports: [
    WelcomeComponent,
    TabsLinksComponent,
    SplashscreenComponent,
    ErrorsComponent,
    ConfirmComponent,
    OnbdHealthComponent,
    OnbdAlojamientoComponent
  ]
})
export class WidgetsModule { }
