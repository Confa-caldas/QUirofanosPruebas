import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from ".//app-routing.module";
import { LayoutComponent } from "./layout/layout.component";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AccordionModule } from "ngx-bootstrap/accordion";
import { ToastrModule } from "ngx-toastr";
import { ImageCropperModule } from 'ngx-image-cropper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
//import { MapsComponent } from './maps/maps.component';
import { RestProvider } from "./providers/rest/rest";

import { MyDatePickerModule } from "mydatepicker";
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from "ngx-bootstrap/tabs";
import { ModalModule } from "ngx-bootstrap/modal";

import es from "@angular/common/locales/es-CO";
import { registerLocaleData } from "@angular/common";
import { LOCALE_ID } from "@angular/core";
import { SearchComponent } from "./search/search.component";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { NgxPageScrollModule } from "ngx-page-scroll";
import { ConfirmComponent } from "./confirm/confirm.component";
import { RecoverComponent } from "./recover/recover.component";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { LayoutHeaderComponent } from "./layout/layout-header/layout-header.component";
import { HomeComponent } from "./components/home/home.component";
import { WidgetsModule } from "./components/widgets/widgets.module";
import { AuthModule } from "./components/auth/auth.module";
//import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
//import { ErrorsComponent } from './components/widgets/errors/errors.component';
import { ClickOutsideModule } from "ng-click-outside";
import { CookieService } from "ngx-cookie-service";
import { EliminarNumerosPipe } from "./services/pipes/eliminar-numeros.pipe";

registerLocaleData(es);

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: "",
  maxFilesize: 50,
  acceptedFiles: null,
};

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    SearchComponent,
    ConfirmComponent,
    RecoverComponent,
    LayoutHeaderComponent,
    HomeComponent,
    EliminarNumerosPipe,
  ],
  exports: [],
  imports: [
    BrowserModule,

    ClickOutsideModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    AuthModule,
    WidgetsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 10000,
      preventDuplicates: false,
      positionClass: 'toast-top-center',
      enableHtml: true,
      iconClasses: {
        error: 'toast-error',
      }
    }),
    CollapseModule.forRoot(),
    NgxPageScrollModule,
    ImageCropperModule,
    DropzoneModule,
    CarouselModule.forRoot(),
    MyDatePickerModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BsDropdownModule.forRoot(),
  ],
  providers: [
    RestProvider,
    CookieService,
    BsModalRef,
    BsModalService,
    {
      provide: LOCALE_ID,
      useValue: "es-CO",
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
