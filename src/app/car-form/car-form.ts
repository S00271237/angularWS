import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { CarService } from '../features/cars/services/car.service';
import { Car } from '../features/cars/models/car.model';
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

   carForm = this.formBuilder.group({
     make: ['', Validators.required],
     model: ['', Validators.required],
     year: ['']
   });

   carService = new CarService

onSubmit(): void {
      const carData: Car = this.carForm.value as Car;
      console.log('Submitted Car:', carData);
      
      this.carService.addCar(carData).subscribe({
        next: (response) => {
          console.log('Car added successfully:', response);
        },
        error: (error) => {
          console.error('Error adding car:', error);
        }
        
      });
            this.router.navigate(['/cars']); 
      
    }
  }




