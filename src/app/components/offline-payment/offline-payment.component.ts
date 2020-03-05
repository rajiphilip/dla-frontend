import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDatepickerInputEvent } from '@angular/material';
import { DlaService } from 'src/app/shared/dla.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Payment } from 'src/app/model/payment.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-offline-payment',
  templateUrl: './offline-payment.component.html',
  styleUrls: ['./offline-payment.component.css']
})
export class OfflinePaymentComponent implements OnInit {
  tellerForm: FormGroup;
  submitted = false;
  payment_date: string;


  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OfflinePaymentComponent>,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private dlaService: DlaService) {
    this.tellerForm = this.formBuilder.group({
      tellerNo: ['', Validators.required],
      paymentDate: ['', Validators.required],
      paidBy: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')]],
    });
  }

  ngOnInit() {
    // console.log('Session: ', this.data);

  }


  get f() { return this.tellerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.tellerForm.invalid) {
      return;
    }

    let paymentRequest: Payment = {
      user_id: this.data.userinfo.user_id,
      session_id: this.data.session.session_id,
      course_id: this.data.session.course_id,
      type: 'bank_transfer',
      amount: this.tellerForm.value.amount,
      description: 'Payment for ' + this.data.session.course + '(' + this.data.session.theme + ')',
      paid_by: this.tellerForm.value.paidBy,
      hash: '',
      payment_date: this.payment_date,
      reference_number: this.tellerForm.value.tellerNo,
      has_prerequisite: this.data.session.has_prerequisite
    };


    // console.log(paymentRequest);


    this.dlaService.makeOfflinePayment(paymentRequest).subscribe(
      (data: any) => {
        this.spinner.hide();
        const error: boolean = data.error;
        if (!error) {
          localStorage.clear();
          localStorage.setItem('dla_student', JSON.stringify(data.user));
          this.alertService.success(data.message);
          this.spinner.hide();
          this.tellerForm.reset();
          this.dialogRef.close();
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

}
