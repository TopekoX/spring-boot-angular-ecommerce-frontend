import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  constructor() { }

  getCreditCardMonth(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    // build an array month for "Month" dropdown list
    // start with a current month and loop until

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYear(): Observable<number[]> {
    
    let data: number[] = [];

    // build an array month for "Month" dropdown list
    // start with a current month and loop until

    const startYear: number = new Date().getFullYear(); // get current year
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
  
}
