import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { DlaService } from 'src/app/shared/dla.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	mainPageTitle = 'Student Dashboard';
	sessions: any[];
	userinfo: any;

	constructor(
		private spinner: NgxSpinnerService,
		private alertService: AlertService,
		private dlaService: DlaService
	) { }


	ngOnInit() {
		this.loadScripts();
		this.userinfo = JSON.parse(localStorage.getItem('dla_student'));
		// console.log(this.userinfo);

		this.spinner.show();
		this.dlaService.getCurrentSessions().subscribe(
			(data: any) => {
				this.spinner.hide();
				const error: boolean = data.error;
				if (!error) {
					// console.log(data);
					this.sessions = data.sessions;
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


	checkPaid(course_id) {
		const status: boolean = this.userinfo.courses.some(x => x === course_id);
		return status;
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
