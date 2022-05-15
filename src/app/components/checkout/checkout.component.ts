import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  chekoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private formBuilder: FormBuilder) { }

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

}
