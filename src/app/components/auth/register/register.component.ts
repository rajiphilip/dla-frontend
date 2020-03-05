import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../../_helpers/must-match.validator';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from 'ngx-alerts';
import {DlaService} from '../../../shared/dla.service';
import {MatDatepickerInputEvent} from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  isTeenager = false;
  age = 0;
  year: string;
  accountTypes: any[] = [
    {id: 'ADULT', name: 'ADULT'},
    {id: 'TEENAGER', name: 'TEENAGER'}
  ];

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private dlaService: DlaService) {
    this.registerForm = this.formBuilder.group({
      accountType: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      othername: [''],
      role_id: [5],
      gender: ['', Validators.required],
      marital_status: ['SINGLE', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
      phone_number: ['', [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]*$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      residence_address: ['', Validators.required],
      country: ['', Validators.required],
      date_of_birth: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.loadScripts();
  }

  ngOnInit() {
    this.year = new Date().getFullYear().toString();
  }

  get f() {
    return this.registerForm.controls;
  }

  checkSeletedType(event: string) {
    if (event === 'TEENAGER') {
      this.isTeenager = true;
    } else {
      this.isTeenager = false;
    }
  }


  addEvent(type: string, elem: string, eventArg, event: MatDatepickerInputEvent<Date>) {
    // this.events.push(`${type}: ${event.value}`);
    const re = /\//gi;
    let datestr: string = eventArg.targetElement.value;
    datestr = datestr.replace(re, '-');

    const breakdown = datestr.split('-');
    const newString = breakdown[2] + '-' + this.padString(breakdown[0]) + '-' + this.padString(breakdown[1]);

    const timeDiff = Math.abs(Date.now() - event.value.getTime());
    this.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
    if (this.isTeenager && this.age < 13) {
      this.alertService.danger('You are not eligible to register for Teenage Programme.');
    }
  }

  padString(n) {
    const z = '0';
    return n.length >= 2 ? n : new Array(2 - n.length + 1).join(z) + n;
  }

  submitRegister() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    if (this.isTeenager && this.age < 13) {
      this.alertService.danger('You are not eligible to register for Teenage Programme.');
      return;
    }

    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
    this.spinner.show();
    this.dlaService.registerUser(this.registerForm.value).subscribe(
      (data: any) => {
        this.spinner.hide();
        const error: boolean = data.error;
        console.log('Register Response:', data);
        if (!error) {
          this.alertService.success(data.message);
          this.router.navigate(['/login']);
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
