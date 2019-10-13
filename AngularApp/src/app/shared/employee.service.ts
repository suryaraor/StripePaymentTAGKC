import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Employee } from './employee.model';

@Injectable()
export class EmployeeService {
  selectedEmployee: Employee;
  mode: string;
  employees: Employee[];
  readonly baseURL = 'http://localhost:3000/employees';
  readonly retreiveEmployeeURL = this.baseURL + '/retrieve/';

  constructor(private http: HttpClient) { }

  postEmployee(emp: Employee) {
    return this.http.post(this.baseURL, emp);
  }

  processStripeCharge(emp: Employee) {
    return this.http.post(this.baseURL+'/charge', JSON.stringify(emp.token));
  }


  getEmployeeList() {
    return this.http.get(this.baseURL);
  }

  getEmployee(emp: Employee) {
    return this.http.post(this.retreiveEmployeeURL, emp);
  }

  putEmployee(emp: Employee) {
    return this.http.put(this.baseURL + `/${emp._id}`, emp);
  }

  deleteEmployee(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }

}
