import { Component, inject, input, signal } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Car } from '../features/cars/models/car.model';
import { CarService } from '../features/cars/services/car.service';
import { LoadState, withLoadState } from '../shared/load-state';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-car-details',
  imports: [],
  templateUrl: './car-details.html',
  styleUrl: './car-details.scss',
})
export class CarDetails {

  private carService = inject(CarService);

  readonly id = input.required<string>();

  readonly initial: LoadState<Car> = { status: 'loading' };

  state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => withLoadState(this.carService.getCarById(id))),
    ),
    { initialValue: this.initial },
  );

}

