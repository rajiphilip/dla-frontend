import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {AlertService} from "ngx-alerts";
import {DlaService} from "../../../shared/dla.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  submitted = false;
  year: string;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private dlaService: DlaService) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
    });

    this.loadScripts();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  ngOnInit() {
    this.year = new Date().getFullYear().toString();
  }


  submitResetPassword(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    // display form values on success
   // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.forgotPasswordForm.value, null, 4));

    this.spinner.show();
    this.dlaService.forgotPassword(this.forgotPasswordForm.value.email).subscribe(
      (data: any) => {
        this.spinner.hide();
        const error: boolean = data.error;
        if (!error) {
          this.alertService.success(data.message);
          this.forgotPasswordForm.reset();
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
