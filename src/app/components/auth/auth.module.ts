import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { AuthValidateDocumentComponent } from './auth-validate-document/auth-validate-document.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    AccordionModule.forRoot(),
    TooltipModule.forRoot()
  ],
  exports: [
    AuthLoginComponent,
    AuthValidateDocumentComponent,
    AuthRegisterComponent
  ],
  declarations: [
    AuthLoginComponent,
    AuthRegisterComponent,
    AuthValidateDocumentComponent
  ]
})
export class AuthModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}