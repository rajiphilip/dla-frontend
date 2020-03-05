import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { DlaService } from 'src/app/shared/dla.service';
import { MatDatepickerInputEvent } from '@angular/material';
import { Payment } from 'src/app/model/payment.model';

@Component({
	selector: 'app-donate',
	templateUrl: './donate.component.html',
	styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {
	mainPageTitle = 'Donate';
	@ViewChild('payBtn', { static: false }) payBtn: ElementRef<HTMLElement>;
	donateForm: FormGroup;
	submitted = false;
	reference = '';
	userinfo: any;
	payment_date: string;
	isOfflineTransfer = false;
	my_email = '';
	amount = 100;

	constructor(
		private formBuilder: FormBuilder,
		private spinner: NgxSpinnerService,
		private alertService: AlertService,
		private dlaService: DlaService) {
		this.donateForm = this.formBuilder.group({
			paymentType: ['', Validators.required],
			paymentDate: [''],
			tellerNo: [''],
			amount: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')]]
		});
	}


	ngOnInit() {
		this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
		this.userinfo = JSON.parse(localStorage.getItem('dla_student'));

		// console.log(this.userinfo);
		this.my_email = this.userinfo.email;

		console.log(this.getNowDate());
		this.loadScripts();
	}

	get f() { return this.donateForm.controls; }

	checkSeletedType(event: string) {
		console.log(event);
		if (event === 'bank_tranfer') {
			this.isOfflineTransfer = true;

		} else {

			this.isOfflineTransfer = false;
		}
	}

	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.donateForm.invalid) {
			return;
		}

		this.amount = this.donateForm.value.amount * 100;

		if (this.donateForm.value.paymentType === 'online_payment') {
			let el: HTMLElement = this.payBtn.nativeElement;
			el.click();
			return;
		} else {
			let paymentRequest: Payment = {
				user_id: this.userinfo.user_id,
				session_id: "",
				course_id: "",
				type: 'bank_tranfer',
				amount: this.amount / 100,
				description: 'Donation',
				paid_by: this.userinfo.firstname + ' ' + this.userinfo.lastname,
				hash: "",
				payment_date: this.payment_date,
				reference_number: this.donateForm.value.tellerNo,
			};

			this.postDonation(paymentRequest);
		}
	}

	postDonation(paymentRequest: Payment) {
		this.dlaService.makeDonation(paymentRequest).subscribe(
			(data: any) => {
				this.spinner.hide();
				const error: boolean = data.error;
				if (!error) {
					this.alertService.success(data.message);
					this.spinner.hide();
					this.donateForm.reset();
				} else {
					this.spinner.hide();
					this.alertService.danger(data.message);
				}
			},
			error => {
				this.spinner.hide();
				// console.log('Error: ', error);
				this.alertService.danger('An error occurred, Please try again');
			}
		);
	}

	setAmount() {
		this.amount = this.donateForm.value.amount * 100;
		console.log(this.amount);
	}

	addEvent(type: string, elem: string, eventArg, event: MatDatepickerInputEvent<Date>) {

		const re = /\//gi;
		let datestr: string = eventArg.targetElement.value;
		datestr = datestr.replace(re, '-');

		const breakdown = datestr.split('-');
		const newString = breakdown[2] + '-' + this.padString(breakdown[0]) + '-' + this.padString(breakdown[1]);

		this.payment_date = newString;

		console.log(newString);
	}

	padString(n) {
		const z = '0';
		return n.length >= 2 ? n : new Array(2 - n.length + 1).join(z) + n;
	}

	paymentInit() {
		console.log('Payment initialized');
	}

	paymentDone(ref: any) {
		// this.title = 'Payment successfull';
		console.log(ref);

		if (ref.status === 'success') {
			let paymentRequest: Payment = {
				user_id: this.userinfo.user_id,
				session_id: "",
				course_id: "",
				type: 'online_payment',
				amount: this.amount / 100,
				description: 'Donation',
				paid_by: this.userinfo.firstname + ' ' + this.userinfo.lastname,
				hash: ref.transaction,
				payment_date: this.getNowDate(),
				reference_number: ref.reference,
			};

			this.postDonation(paymentRequest);
		}
	}

	paymentCancel() {
		console.log('payment failed');
	}

	getNowDate() {
		//return string
		var returnDate = "";
		//get datetime now
		var today = new Date();
		//split
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //because January is 0! 
		var yyyy = today.getFullYear();

		returnDate += yyyy;
		//Interpolation date
		if (mm < 10) {
			returnDate += `-0${mm}`;
		} else {
			returnDate += `-${mm}`;
		}

		if (dd < 10) {
			returnDate += `-0${dd}`;
		} else {
			returnDate += `-${dd}`;
		}

		return returnDate;
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
			// 'assets/js/morrisjs/raphael-min.js',
			// 'assets/js/morrisjs/morris.js',
			// 'assets/js/morrisjs/morris-active.js',
			'assets/js/sparkline/jquery.sparkline.min.js',
			'assets/js/sparkline/jquery.charts-sparkline.js',
			'assets/js/calendar/moment.min.js',
			'assets/js/calendar/fullcalendar.min.js',
			'assets/js/calendar/fullcalendar-active.js',
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
