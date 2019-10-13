import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../shared/employee.model';

declare var M: any;

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  providers: [EmployeeService]
})
export class MemberListComponent implements OnInit {

  showUserRegistrationScreen = true;
  showPaymentScreen = true;
  showAllMembers = false;

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit() {
    this.resetForm();
    this.refreshEmployeeList();

    this.showUserRegistrationScreen = false;
    this.showPaymentScreen = false;
    this.showAllMembers = true;
  }

  resetForm(form?: NgForm) {
    if (form) {
      this.showUserRegistrationScreen = false;
      this.showPaymentScreen = false;
      this.showAllMembers = true;
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
      token : null,
      card: null
    };
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
  onSubmit(form: NgForm) {
    if (form.value._id === '') {
      form.value.paymentStatus = 'User created';
      form.value.paymentStatus = 'Not Paid';
      this.employeeService.postEmployee(form.value).subscribe((res) => {
        this.refreshEmployeeList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
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
    M.toast({ html: 'onEdit', classes: 'rounded' });
    this.employeeService.selectedEmployee = emp;
   
    this.employeeService.mode = 'edit';
    this.router.navigate(['/register']); 
   
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
