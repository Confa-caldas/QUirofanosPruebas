import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthComponent } from './health.component';
import { LoginHealthComponent } from './login-health/login-health.component';
import { HealthRoutingModule } from './health-routing.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MyDatePickerModule } from 'mydatepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { MainHealthComponent } from './main-health/main-health.component';
import { ScheduleAppointmentComponent } from './appointment/schedule-appointment/schedule-appointment.component';
import { AttentionInformationComponent } from './sections/attention-information/attention-information.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AppointmentComponent } from './appointment/appointment/appointment.component';
import { DownloadAppComponent } from './sections/download-app/download-app.component';
import { FrequentQuestionsComponent } from './sections/frequent-questions/frequent-questions.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TermsConditionsComponent } from './sections/terms-conditions/terms-conditions.component';
import { StepFormWidgetComponent } from './sections/forms/step-form-widget/step-form-widget.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
//import { CalendarWidgetComponent } from './sections/forms/calendar-widget/calendar-widget.component';

//import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
//import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
//import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HistoricAppointmentComponent } from './appointment/historic-appointment/historic-appointment.component';
import { BreadcrumbsComponent } from '../widgets/breadcrumbs/breadcrumbs.component';
import { TabsLinksComponent } from '../widgets/tabs-links/tabs-links.component';
import { SplashscreenComponent } from '../widgets/splashscreen/splashscreen.component';
import { ErrorsComponent } from '../widgets/errors/errors.component';
import { ConfirmComponent } from '../widgets/confirm/confirm.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentAppointmentSumaryComponent } from './appointment/payment-appointment-sumary/payment-appointment-sumary.component';
import { FormRegisterComponent } from './form-register/form-register.component';
import { OperatingRoomComponent } from './appointment/operating-room/operating-room.component';
import { ModalMessagesComponent } from './sections/modal-messages/modal-messages.component';


/* 
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
 */
@NgModule({
    imports: [
        CommonModule,
        WidgetsModule,
        RouterModule,
        HealthRoutingModule,
        TranslateModule.forChild(),
        MyDatePickerModule,
        ReactiveFormsModule,
        NgxCaptchaModule,
        TabsModule,
        NgSelectModule,
        AccordionModule.forRoot(),
        TooltipModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
     //   PerfectScrollbarModule
    ],
    exports: [],
    declarations: [
        HealthComponent,
        LoginHealthComponent,
        MainHealthComponent,
        ScheduleAppointmentComponent,
        AttentionInformationComponent,
        AppointmentComponent,
        DownloadAppComponent,
        FrequentQuestionsComponent,
        TermsConditionsComponent,
        StepFormWidgetComponent,
       // CalendarWidgetComponent,
        HistoricAppointmentComponent,
        BreadcrumbsComponent,
        PaymentAppointmentSumaryComponent,
        FormRegisterComponent,
        OperatingRoomComponent,
        ModalMessagesComponent
    ],
 /*    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ] */
})



export class HealthModule { }
