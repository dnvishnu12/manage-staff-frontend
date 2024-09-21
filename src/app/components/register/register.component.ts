import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  registerEmployee(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    
    const employeeData = {
      name: (form.querySelector('#name') as HTMLInputElement).value,
      email: (form.querySelector('#email') as HTMLInputElement).value,
      position: (form.querySelector('#position') as HTMLInputElement).value,
      department: (form.querySelector('#department') as HTMLInputElement).value,
    };

    this.http.post('http://localhost:8080/addEmployee', employeeData)
      .subscribe(
        response => {
          console.log('Employee registered successfully:', response);
          this.openSnackBar('Employee registered successfully!', 'Close');
        },
        error => {
          console.error('Error registering employee:', error);
        }
      );
  }

  openSnackBar(message: string, action: string) {
    const snackBarRef: MatSnackBarRef<any> = this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });

    snackBarRef.afterDismissed().subscribe(() => {
      console.log('Snackbar dismissed, refreshing the page.');
      window.location.reload();
    });
  }
}
