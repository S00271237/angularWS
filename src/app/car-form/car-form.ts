import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { CarService } from '../features/cars/services/car.service';
import { Car, CreateCarDto } from '../features/cars/models/car.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})
export class CarForm {
     private formBuilder = inject(FormBuilder);
     private router = inject(Router)

   carForm = this.formBuilder.nonNullable.group({
     make: ['', Validators.required],
     model: ['', Validators.required],
     year: this.formBuilder.control<number|null> (null)
   });


   carService = new CarService

onSubmit(): void {

  const { make, model, year } = this.carForm.getRawValue();
  const newCar: CreateCarDto = { make, model, year: year ?? undefined };
      
      console.log('Submitted Car:', newCar);

      this.carService.addCar(newCar).subscribe({
        next: (response) => {
          console.log('Car added successfully:', response);
          this.router.navigate(['/cars']); 
        },
        error: (error) => {
          console.error('Error adding car:', error);

        }
        
      });
            this.router.navigate(['/cars']); 
      
    }
  }




