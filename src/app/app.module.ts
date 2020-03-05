import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AlertModule } from 'ngx-alerts';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatInputModule, MatNativeDateModule, MatDialogModule } from '@angular/material';
import { Angular4PaystackModule } from 'angular4-paystack';
import { DlaService } from './shared/dla.service';
import { AuthGuard } from './auth/auth.guard';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ConfirmEmailComponent } from './components/auth/confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { MobileNavComponent } from './components/shared/mobile-nav/mobile-nav.component';
import { HeaderTopComponent } from './components/shared/header-top/header-top.component';
import { MobileLogoComponent } from './components/shared/mobile-logo/mobile-logo.component';
import { BreadcrumAreaComponent } from './components/shared/breadcrum-area/breadcrum-area.component';
import { MainHeaderComponent } from './components/shared/main-header/main-header.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { StudentSessionComponent } from './components/student-session/student-session.component';
import { DonateComponent } from './components/donate/donate.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { OfflinePaymentComponent } from './components/offline-payment/offline-payment.component';

const routes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'forgot-password', component: ForgotPasswordComponent },
	{ path: 'confirm-email', component: ConfirmEmailComponent },
	{ path: 'change-password', component: ResetPasswordComponent, canActivate: [AuthGuard] },
	{ path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard] },
	{ path: 'student-session/:id', component: StudentSessionComponent, canActivate: [AuthGuard] },
	{ path: 'donate', component: DonateComponent, canActivate: [AuthGuard] },
	{ path: '', redirectTo: '/', pathMatch: 'full' },
	{ path: '404', component: NotFoundComponent },
	{ path: '**', redirectTo: '404' }
];

@NgModule({
	declarations: [
		AppComponent,
		FooterComponent,
		HeaderComponent,
		LoginComponent,
		RegisterComponent,
		ConfirmEmailComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		HomeComponent,
		MobileNavComponent,
		HeaderTopComponent,
		MobileLogoComponent,
		BreadcrumAreaComponent,
		MainHeaderComponent,
		MyProfileComponent,
		StudentSessionComponent,
		DonateComponent,
		NotFoundComponent,
		OfflinePaymentComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(routes),
		NgxSpinnerModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		MatDialogModule,
		FormsModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		AlertModule.forRoot({ maxMessages: 5, timeout: 7000, position: 'right' }),
		Angular4PaystackModule.forRoot('pk_test_21a006ba15e2de1bb6d7bf0f18fbe09283060ac6'),
	],
	entryComponents: [OfflinePaymentComponent],
	providers: [DlaService, AuthGuard],
	bootstrap: [AppComponent]
})
export class AppModule { }
