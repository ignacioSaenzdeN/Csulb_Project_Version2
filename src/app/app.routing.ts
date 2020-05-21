import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_helpers';
import { ChartsComponent } from './charts';
import { ProfileComponent} from './profile/profile.component';
import {UploadFileComponent} from './charts/upload-file/upload-file.component';
const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'charts', component: ChartsComponent },
    {path: 'profile',component: ProfileComponent},
    {path: 'uploadView', component: UploadFileComponent},

    // otherwise redirect to home
    { path: '**', redirectTo: 'login' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
