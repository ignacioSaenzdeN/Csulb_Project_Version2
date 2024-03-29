import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_helpers';
import { ChartsComponent } from './charts';
import { ProfileComponent } from './profile/profile.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { TrainComponent } from './train/train.component';
import { AccountResetComponent } from './account-reset/account-reset.component';
import { AccountResetValidateComponent } from "./account-reset/account-reset-validate/account-reset-validate.component";
import { SnapshotChartComponent } from './snapshot-chart/snapshot-chart.component';


// Here is where paths and the paths' references should be added
const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'charts', component: ChartsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'uploadView', component: UploadFileComponent },
    { path: 'train', component: TrainComponent},
    { path: 'account-reset', component: AccountResetComponent },
    { path: 'account-reset-validate', component: AccountResetValidateComponent },
    { path: 'snapshot-chart', component: SnapshotChartComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: 'login' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
