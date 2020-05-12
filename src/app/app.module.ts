import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend


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
import { DragDropDirective } from './charts/drag-drop.directive';
import { UploadFileComponent } from './charts/upload-file/upload-file.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule,
        Ng5SliderModule,

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

        // ChartsComponent,
        // BarChartComponent,
        // LineChartComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend

    ],
    bootstrap: [AppComponent]
})
export class AppModule { };
