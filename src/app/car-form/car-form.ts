import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { CarService } from '../features/cars/services/car.service';
import { Car } from '../features/cars/models/car.model';
import { Router, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import {CreateCarDto} from '../features/cars/models/car.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { input } from '@angular/core';
import { OnInit } from '@angular/core';
import { forbiddenValue, notBlank } from '../shared/validators/not-blank.validator';

@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatProgressBarModule, RouterLink],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})
export class CarForm implements OnInit {
    private formBuilder = inject(FormBuilder);
    private router = inject(Router)
    saving = signal(false);
    saveError = signal<string | null>(null);
    private snackBar = inject(MatSnackBar);
    readonly id = input<string>();  // note this is optional by default


  readonly currentYear = new Date().getFullYear();

  carForm = this.formBuilder.nonNullable.group({
    make: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), notBlank, forbiddenValue('test')]],
    model: ['', [Validators.required, Validators.maxLength(30), notBlank, forbiddenValue('test')]],
    year: this.formBuilder.control<number | null>(null, [Validators.min(1950), Validators.max(this.currentYear + 1),]),
  });




   carService = new CarService

  ngOnInit(): void {
    const id = this.id();
    if (!id) return; // adding a new car, nothing to load

    this.carService.getCarById(id).subscribe({
      next: (car) =>
        this.carForm.patchValue({ make: car.make, model: car.model, year: car.year ?? null }),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }


  onSubmit(): void {

    if(this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      return;
    }
    

    const { make, model, year } = this.carForm.getRawValue();
    const newCar: CreateCarDto = { make, model, year: year ?? undefined };

    this.saving.set(true);
    this.saveError.set(null);

    const id = this.id();

    const request = id
      ? this.carService.updateCar(id, newCar)
      : this.carService.addCar(newCar);

    request.subscribe({
        next: (response) => {
        this.snackBar.open(`${newCar.make} ${newCar.model} saved`, 'Close', { duration: 10000 });
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
