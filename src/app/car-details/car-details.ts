import { Component, inject, input, signal } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Car } from '../features/cars/models/car.model';
import { CarService } from '../features/cars/services/car.service';
import { LoadState, withLoadState } from '../shared/load-state';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-details',
  imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatProgressBarModule],
  templateUrl: './car-details.html',
  styleUrl: './car-details.scss',
})
export class CarDetails {

  private carService = inject(CarService);

  private readonly router = inject(Router);


  readonly id = input.required<string>();

  readonly initial: LoadState<Car> = { status: 'loading' };

  readonly deleting = signal(false);
  
  readonly deleteError = signal<string | null>(null);


  state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => withLoadState(this.carService.getCarById(id))),
    ),
    { initialValue: this.initial },
  );

deleteCar(car: Car): void {
  if (!confirm(`Delete ${car.make} ${car.model}?`)) return;

  this.deleting.set(true);
  this.deleteError.set(null);

  this.carService.deleteCar(car._id).subscribe({
    next: () => this.router.navigate(['/cars']),
    error: (err: Error) => {
      this.deleteError.set(err.message);
      this.deleting.set(false);
    },
  });
}



}

