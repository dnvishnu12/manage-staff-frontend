import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  employees$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  isModalOpen = false;
  selectedEmployee: any;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.http.get<any[]>('http://localhost:8080/getAllEmployees').subscribe(
      data => {
        this.employees$.next(data);
      },
      error => {
        console.error('Error fetching employee data', error);
      }
    );
  }

  openEditModal(employee: any) {
    this.selectedEmployee = { ...employee };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  updateEmployee() {
    const { email, ...updatedData } = this.selectedEmployee;

    this.http.put(`http://localhost:8080/updateEmployee?email=${email}`, updatedData, {
      responseType: 'text'
    }).subscribe(
      response => {
        console.log('Employee updated successfully', response);
        this.openSnackBar('Employee updated successfully', 'Close');
        this.closeModal();
        this.fetchEmployees();
      },
      error => {
        console.error('Error updating employee', error);
      }
    );
  }

  deleteEmployee(email: string) {
    this.http.delete(`http://localhost:8080/deleteEmployee?email=${email}`, {
      responseType: 'text'
    }).subscribe(
      response => {
        console.log('Employee deleted successfully', response);
        this.openSnackBar('Employee deleted successfully', 'Close');
        this.fetchEmployees();
      },
      error => {
        console.error('Error deleting employee', error);
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
}
