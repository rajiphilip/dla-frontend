import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from 'ngx-alerts';
import {DlaService} from '../../../shared/dla.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  year: string;
  bspoke: string;
  grad: string;
  message = '';
  error = false;
  response = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private dlaService: DlaService) {
    this.loadScripts();
  }

  ngOnInit() {
    this.year = new Date().getFullYear().toString();
    this.bspoke = this.route.snapshot.queryParamMap.get('bspoke');
    this.grad = this.route.snapshot.queryParamMap.get('grad');

    if (this.bspoke !== undefined && this.bspoke !== null && this.bspoke !== '' && this.grad !== undefined && this.grad !== null && this.grad !== '') {
      this.spinner.show();
      this.dlaService.activateAccount(this.bspoke, this.grad).subscribe(
        (data: any) => {
          this.spinner.hide();
          const error: boolean = data.error;
          this.response = true;
          if (!error) {
            this.error = true;
            this.message = data.message;
            this.alertService.success(data.message);
            console.log(data);
          } else {
            this.error = false;
            this.message = data.message;
            this.alertService.danger(data.message);
          }
        },
        error => {
          this.spinner.hide();
          this.alertService.danger('An error occurred, Please try again');
        }
      );
    } else {
      this.alertService.danger('Invalid activation link, kindly contact administrator.');
    }
    console.log('Token: ', this.bspoke);
    console.log('User ID: ', this.grad);
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
