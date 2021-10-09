import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';

import { appRoutingModule } from './app.routing';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';
import { LoginComponent } from './login';

import { RegisterComponent } from './register';
import { AlertComponent } from './_components';
import { ChartsComponent } from './charts/charts.component';

//slider
import { Ng5SliderModule } from 'ng5-slider';
import { ProfileComponent } from './profile/profile.component';

// Drag and Drop Stuff
import { DragDropDirective } from './upload-file/drag-drop.directive';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { AccountResetComponent } from './account-reset/account-reset.component';
import { AccountResetValidateComponent } from './account-reset/account-reset-validate/account-reset-validate.component';

//FormsModule for dropdown in data submission
import { FormsModule } from '@angular/forms';
import { SnapshotChartComponent } from './snapshot-chart/snapshot-chart.component';



@NgModule({

    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule,
        Ng5SliderModule,
        FormsModule,
        NgProgressModule,
        NgProgressHttpModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent,
        ChartsComponent,
        ProfileComponent,
        DragDropDirective,
        UploadFileComponent,
        AccountResetComponent,
        AccountResetValidateComponent,
        SnapshotChartComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend

    ],
    bootstrap: [AppComponent]
})
export class AppModule { };
