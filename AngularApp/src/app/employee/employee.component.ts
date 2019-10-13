import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';


import { NgForm } from '@angular/forms';

import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../shared/employee.model';
import { tokenName } from '@angular/compiler';

declare var M: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [EmployeeService]
})
export class EmployeeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('cardInfo', null) cardInfo: ElementRef;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;




  showUserRegistrationScreen = true;
  showPaymentScreen = true;
  showAllMembers = false;

  constructor(private employeeService: EmployeeService, private cd: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);

    this.card.addEventListener('change', this.cardHandler);
  }


  ngOnInit() {
    if(this.employeeService.mode == 'edit'){
      M.toast({ html: 'loading' + this.employeeService.selectedEmployee, classes: 'rounded' });

    }else{
      this.resetForm();
      this.refreshEmployeeList();
    }
   

    this.showUserRegistrationScreen = true;
    this.showPaymentScreen = false;
    this.showAllMembers = false;
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  async onStripeSubmit(form: NgForm) {
    const { token, error } = await stripe.createToken(this.card);

    if (error) {
      console.log('Something is wrong:', error);
    } else {
      console.log('Success!', token);
      console.log('Success!', token.id);
      console.log('Success!', token);
      this.employeeService.selectedEmployee.token = token;
      this.employeeService.selectedEmployee.card = this.card;
      // ...send the token to the your backend to process the charge
      this.employeeService.processStripeCharge(this.employeeService.selectedEmployee).subscribe((res) => {
        M.toast({ html: 'Posted Payment'+res, classes: 'rounded' });
      });


      this.employeeService.selectedEmployee.paymentStatus = 'Payment Completed';
      M.toast({ html: 'Updated successfully', classes: 'rounded' });
      this.employeeService.selectedEmployee.paymentDetails = 'success'+token.id;
      M.toast({ html: 'this.employeeService.selectedEmployee.paymentDetails '+this.employeeService.selectedEmployee.paymentDetails, classes: 'rounded' });
      form.value.paymentStatus = this.employeeService.selectedEmployee.paymentStatus ;
      M.toast({ html: 'form.value.paymentDetails'+form.value.paymentDetails, classes: 'rounded' });
      form.value.paymentDetails = this.employeeService.selectedEmployee.paymentDetails ;
      this.employeeService.putEmployee(this.employeeService.selectedEmployee).subscribe((res) => {
        this.refreshEmployeeList();
        M.toast({ html: 'PUT successfully', classes: 'rounded' });
      });
    }
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }


  resetForm(form?: NgForm) {
    if (form) {
      this.showUserRegistrationScreen = true;
      this.showPaymentScreen = false;
      this.showAllMembers = false;
      form.reset();
    }
  
   

    this.employeeService.selectedEmployee = {
      _id: '',
      name: '',
      position: '',
      office: '',
      salary: '',
      paymentStatus: '',
      paymentDetails: '',
      token: null,
      card: null
    };
  }
  onStripePayment() {
    M.toast({ html: 'Thank you for your payment, your registration is successful!', classes: 'rounded' });
    this.showUserRegistrationScreen = false;
    this.showPaymentScreen = true;
  
  }
  onShowFirst(form?: NgForm) {
    this.showAllMembers = true;
    this.showUserRegistrationScreen = false;
    this.showPaymentScreen = false;
  }

  onShowSecond(form?: NgForm) {
    this.showAllMembers = false;
    this.showUserRegistrationScreen = true;
    this.showPaymentScreen = false;
  }

  onShowThird(form?: NgForm) {
    this.showAllMembers = false;
    this.showUserRegistrationScreen = false;
    this.showPaymentScreen = true;
  }
  onProceedToPayment(form: NgForm) {
    M.toast({ html: 'form.value._id = '+form.value._id, classes: 'rounded' });
    if (form.value._id ==null || form.value._id == undefined||  form.value._id === '') {
      this.employeeService.postEmployee(form.value).subscribe((res) => {
        this.refreshEmployeeList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
        this.showUserRegistrationScreen = false;
        this.showPaymentScreen = true;
      });
      this.employeeService.getEmployee(form.value).subscribe((res) => {
        this.employeeService.selectedEmployee = res as Employee;
        M.toast({ html: 'Retrieved successfully' + this.employeeService.selectedEmployee._id, classes: 'rounded' });
        this.showUserRegistrationScreen = false;
        this.showPaymentScreen = true;
      });
    } else {
      this.employeeService.putEmployee(form.value).subscribe((res) => {
        this.refreshEmployeeList();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      });
    }
  }

  onPaymentSubmit(form: NgForm) {
    if (form.value._id === '') {
      this.employeeService.postEmployee(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshEmployeeList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
        this.showUserRegistrationScreen = false;
        this.showPaymentScreen = true;
      });
    } else {
      this.employeeService.putEmployee(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshEmployeeList();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      });
    }
  }

  refreshEmployeeList() {
    this.employeeService.getEmployeeList().subscribe((res) => {
      this.employeeService.employees = res as Employee[];
    });
  }

  onEdit(emp: Employee) {
    this.employeeService.selectedEmployee = emp;
  }

  onDelete(_id: string, form: NgForm) {
    if (confirm('Are you sure to delete this record ?') === true) {
      this.employeeService.deleteEmployee(_id).subscribe((res) => {
        this.refreshEmployeeList();
        this.resetForm(form);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
      });
    }
  }

}
