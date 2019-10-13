import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberListComponent } from './member-list/member-list.component';
import { EmployeeComponent } from './employee/employee.component';
const routes: Routes = [
  { path: 'members', component: MemberListComponent},
  { path: 'register', component: EmployeeComponent}
];


@NgModule({

  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [MemberListComponent, EmployeeComponent];
