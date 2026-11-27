import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { input } from '@angular/core';
import { AuthCustomService } from '../../../../core/auth/auth-custom.service';
import { RegisterUserDto } from '../../../../core/models/user';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatProgressBarModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private formBuilder = inject(FormBuilder);
      private router = inject(Router)
      saving = signal(false);
      saveError = signal<string | null>(null);
      private snackBar = inject(MatSnackBar);
      readonly id = input<string>();  // note this is optional by default
  
  
  
    registerForm = this.formBuilder.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.maxLength(30)]],
    });
  
  
  
  
     authService = new AuthCustomService
  
    ngOnInit(): void {

    }
  
    onSubmit(): void {
  
      if(this.registerForm.invalid) {
        this.registerForm.markAllAsTouched();
        return;
      }
      
  
      const { name, email, password } = this.registerForm.getRawValue();
      const newUser: RegisterUserDto = { name, email, password };
  
      this.saving.set(true);
      this.saveError.set(null);
  
      const id = this.id();
  
      const request = this.authService.addUser(newUser)
  
      request.subscribe({
          next: (response) => {
          this.snackBar.open(`${newUser.name} ${newUser.email} saved`, 'Close', { duration: 10000 });
          console.log('Car added successfully:', response);
          this.router.navigate(['/cars']);
        },
  
      error: (err: Error) => {
        this.saveError.set(err.message);
        this.saving.set(false);
      },
      });
    }

}
