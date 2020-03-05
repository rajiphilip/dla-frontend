import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-not-found',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
	year: string;

	constructor() {
		this.loadScripts();
	}

	ngOnInit() {
		this.year = new Date().getFullYear().toString();
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
