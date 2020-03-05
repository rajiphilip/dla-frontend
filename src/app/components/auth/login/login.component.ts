import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import custom validator to validate that password and confirm password fields match
// https://stackblitz.com/edit/angular -8-reactive-form-validation?file=app%2Fapp.component.ts

import { NgxSpinnerService } from 'ngx-spinner';
import { DlaService } from '../../../shared/dla.service';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { MustMatch } from '../../../_helpers/must-match.validator';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	submitted = false;
	year: string;
	emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';

	constructor(
		private router: Router,
		private spinner: NgxSpinnerService,
		private alertService: AlertService,
		private formBuilder: FormBuilder,
		private dlaService: DlaService) {
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
			password: ['', Validators.required],
		});

		this.loadScripts();
	}

	ngOnInit() {
		this.year = new Date().getFullYear().toString();
		// this.spinner.show();
		//
		// setTimeout(() => {
		//   /** spinner ends after 5 seconds */
		//   this.spinner.hide();
		//   this.showAlerts();
		// }, 5000);
	}

	// convenience getter for easy access to form fields
	get f() { return this.loginForm.controls; }

	submitLogin() {
		this.submitted = true;

		if (this.loginForm.invalid) {
			return;
		}
		//  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value, null, 4));
		this.spinner.show();
		this.dlaService.loginUser(this.loginForm.value.email, this.loginForm.value.password).subscribe(
			(data: any) => {
				this.spinner.hide();
				const error: boolean = data.error;
				if (!error) {
					console.log(data.user);
					this.dlaService.authToken = data.user.auth_token;
					this.dlaService.user = data.user;
					localStorage.clear();
					localStorage.setItem('dla_student', JSON.stringify(data.user));
					this.router.navigate(['/']);
				} else {
					this.alertService.danger(data.message);
				}
			},
			error => {
				this.spinner.hide();
				this.alertService.danger('An error occurred, Please try again');
			}
		);
	}



	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.loginForm.invalid) {
			return;
		}

		// display form values on success
		alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value, null, 4));
	}

	onReset() {
		this.submitted = false;
		this.loginForm.reset();
	}

	showAlerts() {
		// For normal messages
		this.alertService.info('this is an info alert');
		this.alertService.danger('this is a danger alert');
		this.alertService.success('this is a success alert');
		this.alertService.warning('this is a warning alert');

		// For html messages:
		this.alertService.warning({ html: '<b>This message is bold</b>' });
	}

	loadScripts() {
		const dynamicScripts = [
			'assets/js/vendor/jquery-1.11.3.min.js',
			'assets/js/bootstrap.min.js',
			'assets/js/wow.min.js',
			'assets/js/jquery-price-slider.js',
			'assets/js/jquery.meanmenu.js',
			'assets/js/owl.carousel.min.js',
			'assets/js/jquery.sticky.js',
			'assets/js/jquery.scrollUp.min.js',
			'assets/js/scrollbar/jquery.mCustomScrollbar.concat.min.js',
			'assets/js/scrollbar/mCustomScrollbar-active.js',
			'assets/js/metisMenu/metisMenu.min.js',
			'assets/js/metisMenu/metisMenu-active.js',
			'assets/js/tab.js',
			'assets/js/icheck/icheck.min.js',
			'assets/js/icheck/icheck-active.js',
			'assets/js/plugins.js',
			'assets/js/main.js'
		];
		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < dynamicScripts.length; i++) {
			const node = document.createElement('script');
			node.src = dynamicScripts[i];
			node.type = 'text/javascript';
			node.async = false;
			node.charset = 'utf-8';
			document.getElementsByTagName('head')[0].appendChild(node);
		}
	}

}
