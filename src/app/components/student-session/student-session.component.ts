import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DlaService } from 'src/app/shared/dla.service';
import { AlertService } from 'ngx-alerts';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { OfflinePaymentComponent } from '../offline-payment/offline-payment.component';
import { Payment } from 'src/app/model/payment.model';

@Component({
	selector: 'app-student-session',
	templateUrl: './student-session.component.html',
	styleUrls: ['./student-session.component.css']
})
export class StudentSessionComponent implements OnInit {
	@ViewChild('payBtn', { static: false }) payBtn: ElementRef<HTMLElement>;
	mainPageTitle = 'Training Session';
	session_id: string;
	reference = '';
	my_email = '';
	session: any;
	amount = 0;
	userinfo: any;
	metadata: any = {};


	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private spinner: NgxSpinnerService,
		private alertService: AlertService,
		private dlaService: DlaService
	) {
		this.loadScripts();
	}

	ngOnInit() {
		this.session_id = this.route.snapshot.paramMap.get('id');
		this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
		this.userinfo = JSON.parse(localStorage.getItem('dla_student'));

		// console.log(this.userinfo);
		this.my_email = this.userinfo.email;
		this.loadTimeTable();

	}

	loadTimeTable() {
		if (this.session_id !== null && this.session_id !== undefined) {
			this.spinner.show();
			this.dlaService.getSessionAndTimeTable(this.session_id, this.userinfo.user_id).subscribe(
				(data: any) => {
					this.spinner.hide();
					const error: boolean = data.error;
					if (!error) {
						// console.log(data);
						this.session = data.session;
						this.amount = data.session.main_fee * 100;
						this.metadata = {
							course: data.session.course,
							theme: data.session.theme,
							fee: data.session.main_fee
						};
						// console.log(data.session);
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
	}

	checkRegistrationStatus(payment_type: string) {
		console.log(payment_type);

		console.log(this.session.has_prerequisite);

		if (this.session.has_prerequisite == 1) {
			const status: boolean = this.session.prerequisite.some(x => x === this.userinfo.courses[0]);

			if (status) {
				if (payment_type == 'online') {
					this.makePayment();
				} else {
					this.makeOfflinePayment();
				}

			} else {
				this.alertService.danger("You cannot register for this course at the moment, you need to do a basic course before you can register for this course.")
			}

		} else {
			if (payment_type == 'online') {
				this.makePayment();
			} else {
				this.makeOfflinePayment();
			}
		}
	}

	checkPaid(course_id) {
		const status: boolean = this.userinfo.courses.some(x => x === course_id);
		return status;
	}

	makePayment() {
		console.log('Making Payment');
		let el: HTMLElement = this.payBtn.nativeElement;
		el.click();
	}

	makeOfflinePayment() {
		console.log('Making Offline Payment');
		const dialogConfig = new MatDialogConfig();
		dialogConfig.autoFocus = true;
		dialogConfig.disableClose = true;
		dialogConfig.width = '75%';
		dialogConfig.data = { session: this.session, userinfo: this.userinfo };
		this.dialog
			.open(OfflinePaymentComponent, dialogConfig)
			.afterClosed()
			.subscribe(res => {
				// this.startQuiz();
			});
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
				session_id: this.session.session_id,
				course_id: this.session.course_id,
				type: 'online_payment',
				amount: this.session.main_fee,
				description: 'Payment for ' + this.session.course + '(' + this.session.theme + ')',
				paid_by: this.userinfo.firstname + ' ' + this.userinfo.lastname,
				hash: ref.transaction,
				reference_number: ref.reference,
				has_prerequisite: this.session.has_prerequisite
			};


			// console.log(paymentRequest);


			this.dlaService.makeOnlinePayment(paymentRequest).subscribe(
				(data: any) => {
					this.spinner.hide();
					const error: boolean = data.error;
					if (!error) {
						this.spinner.hide();
						localStorage.clear();
						localStorage.setItem('dla_student', JSON.stringify(data.user));
						this.alertService.success(data.message);

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
	}

	paymentCancel() {
		console.log('payment failed');
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
			'assets/js/sparkline/jquery.sparkline.min.js',
			'assets/js/sparkline/jquery.charts-sparkline.js',
			'assets/js/calendar/moment.min.js',
			'assets/js/calendar/fullcalendar.min.js',
			'assets/js/calendar/fullcalendar-active.js',
			'assets/js/data-table/bootstrap-table.js',
			'assets/js/data-table/tableExport.js',
			'assets/js/data-table/data-table-active.js',
			'assets/js/data-table/bootstrap-table-editable.js',
			'assets/js/data-table/bootstrap-editable.js',
			'assets/js/data-table/bootstrap-table-resizable.js',
			'assets/js/data-table/colResizable-1.5.source.js',
			'assets/js/data-table/bootstrap-table-export.js',
			'assets/js/editable/jquery.mockjax.js',
			'assets/js/editable/mock-active.js',
			'assets/js/editable/select2.js',
			'assets/js/editable/moment.min.js',
			'assets/js/editable/bootstrap-datetimepicker.js',
			'assets/js/editable/bootstrap-editable.js',
			'assets/js/editable/xediable-active.js',
			'assets/js/chart/jquery.peity.min.js',
			'assets/js/peity/peity-active.js',
			'assets/js/tab.js',
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
