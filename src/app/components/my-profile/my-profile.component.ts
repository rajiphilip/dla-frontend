import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { DlaService } from '../../shared/dla.service';
import { MustMatch } from "../../_helpers/must-match.validator";

@Component({
	selector: 'app-my-profile',
	templateUrl: './my-profile.component.html',
	styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
	mainPageTitle = 'My Profile';
	userInfo: User;
	myProfileForm: FormGroup;
	submitted = false;

	constructor(
		private spinner: NgxSpinnerService,
		private alertService: AlertService,
		private formBuilder: FormBuilder,
		private dlaService: DlaService
	) {
		this.myProfileForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			otherName: [null],
			matricNumber: [null],
			phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]*$')]],
			profileId: ['', Validators.required],
			gender: ['', Validators.required],
			maritalStatus: ['', Validators.required],
			country: ['', Validators.required],
			residenceAddress: ['', Validators.required],
			authToken: ['', Validators.required],
			userId: ['', Validators.required],
			employmentStatus: [null],
			companyName: [null],
			positionInCompany: [null],
			companyAddress: [null],
			companyPhoneNumber: [null],
			companyEmail: [null],
			religion: [null],
			nameOfMinistry: [null]
		});
	}

	get f() {
		return this.myProfileForm.controls;
	}

	ngOnInit() {
		if (localStorage.getItem('dla_student') !== null) {
			this.userInfo = JSON.parse(localStorage.getItem('dla_student'));
		}

		// console.log('User Info: ', this.userInfo);
		this.loadScripts();
	}

	submitUpdateProfile() {
		this.submitted = true;

		if (this.myProfileForm.invalid) {
			return;
		}


		this.spinner.show();
		this.dlaService.updateProfile(this.userInfo).subscribe(
			(data: any) => {
				this.spinner.hide();
				const error: boolean = data.error;
				if (!error) {
					localStorage.clear();
					this.userInfo = data.user;
					localStorage.setItem('dla_student', JSON.stringify(data.user));
					this.alertService.success(data.message);
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
