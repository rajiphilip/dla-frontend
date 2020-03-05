import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from 'ngx-alerts';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DlaService} from '../../shared/dla.service';
import {MustMatch} from '../../_helpers/must-match.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  mainPageTitle = 'Change Password';
  resetForm: FormGroup;
  submitted = false;
  token: string;
  userId: string;

  constructor(
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private dlaService: DlaService) {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  ngOnInit() {
    this.loadScripts();
    if (localStorage.getItem('dla_student') !== null) {
      this.dlaService.loggedIn = true;
      const userinfo: any = JSON.parse(localStorage.getItem('dla_student'));
      this.userId = userinfo.user_id;
      this.token = userinfo.auth_token;
    }
  }

  submitResetPassword() {
    this.submitted = true;

    if (this.resetForm.invalid) {
      return;
    }

    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.resetForm.value, null, 4));

    this.spinner.show();
    this.dlaService.resetPassword(this.userId, this.resetForm.value.password, this.token).subscribe(
      (data: any) => {
        this.spinner.hide();
        const error: boolean = data.error;
        if (!error) {
          this.alertService.success(data.message);
          this.resetForm.reset();
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
      'assets/js/owl.carousel.min.js',
      'assets/js/jquery.sticky.js',
      'assets/js/jquery.scrollUp.min.js',
      'assets/js/scrollbar/jquery.mCustomScrollbar.concat.min.js',
      'assets/js/scrollbar/mCustomScrollbar-active.js',
      'assets/js/metisMenu/metisMenu.min.js',
      'assets/js/metisMenu/metisMenu-active.js',
      'assets/js/password-meter/pwstrength-bootstrap.min.js',
      'assets/js/password-meter/zxcvbn.js',
      'assets/js/password-meter/password-meter-active.js',
      'assets/js/tab.js',
      'assets/js/plugins.js',
      'assets/js/jquery.meanmenu.js',
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
