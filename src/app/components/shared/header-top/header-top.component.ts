import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DlaService } from '../../../shared/dla.service';

@Component({
	selector: 'app-header-top',
	templateUrl: './header-top.component.html',
	styleUrls: ['./header-top.component.css']
})
export class HeaderTopComponent implements OnInit {
	userinfo: any;
	username: string;
	type: string;
	loggedIn = false;

	constructor(
		private router: Router,
		private dlaService: DlaService) {
		if (localStorage.getItem('dla_student') !== null) {
			this.dlaService.loggedIn = true;

			this.userinfo = JSON.parse(localStorage.getItem('dla_student'));
			// console.log(this.userinfo);
			this.type = this.userinfo.type;
			this.dlaService.authToken = this.userinfo.auth_token;
			this.username = this.userinfo.firstname + ' ' + this.userinfo.lastname + ' (' + this.type + ')';
		} else {
			this.dlaService.loggedIn = false;
		}
	}

	ngOnInit() {
	}

	logout() {
		this.dlaService.loggedIn = false;
		localStorage.clear();
		this.router.navigate(['/login']);
	}
}
