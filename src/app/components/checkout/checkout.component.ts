import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { data } from 'autoprefixer';
import { ShopFormService } from 'src/app/services/shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  chekoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYear: number[] = [];
  creditCardMonth: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService) { }

  ngOnInit(): void {
    this.chekoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate credit card month
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth = " + startMonth);
    
    this.shopFormService.getCreditCardMonth(startMonth).subscribe(
      data => {
        console.log("Retreive Credit Card Month: " + JSON.stringify(data));
        this.creditCardMonth = data;
      }
    );

    // populate credit card year
    this.shopFormService.getCreditCardYear().subscribe(
      data => {
        console.log("Retrive Credit Card Year: " + JSON.stringify(data));
        this.creditCardYear = data;
      }
    )
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.chekoutFormGroup.get('customer')?.value);
    console.log("The email is " + this.chekoutFormGroup.get('customer')?.value.email);
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.chekoutFormGroup.controls['billingAddress']
        .setValue(this.chekoutFormGroup.controls['shippingAddress'].value);
    } else {
      this.chekoutFormGroup.controls['billingAddress'].reset();
    }
  }

  handleMonthAndYear() {
    const creditCardFormGroup = this.chekoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with the current month
    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonth(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card month: " + JSON.stringify(data));
        this.creditCardMonth = data;
      }
    );
  }

}
