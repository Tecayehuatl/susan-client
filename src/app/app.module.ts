import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './login/login.component';
import { GtagModule } from 'angular-gtag';
import { environment } from 'src/environments/environment';

registerLocaleData(localeEs, 'es-MX');
@NgModule({
    declarations: [AppComponent, LoginComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        GtagModule.forRoot({
            trackingId: environment.gtag,
            trackPageviews: true,
        }),
        HttpClientModule,
        AppRoutingModule,
        SharedModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true,
        },
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' },
        },
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: { disableClose: true },
        },
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            },
        },
        { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
        { provide: LOCALE_ID, useValue: 'es-MX' },
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false, showError: true },
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
