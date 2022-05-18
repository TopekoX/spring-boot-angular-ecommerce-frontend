import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidator } from 'src/app/validators/shop-validator';

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

  countries: Country[] = [];
  shippingAddressState: State[] = [];
  billingAddressState: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private shopFormService: ShopFormService) { }

  ngOnInit(): void {
    this.chekoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhiteSpace]),
        email: new FormControl('', [Validators.required, Validators.pattern(
          '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,6}$'
        ), ShopValidator.notOnlyWhiteSpace])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$'), ShopValidator.notOnlyWhiteSpace]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$'), ShopValidator.notOnlyWhiteSpace]),
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

    // populate country
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrive Countries : " + JSON.stringify(data));
        this.countries = data;
      }
    )
  }

  get firstName() { return this.chekoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.chekoutFormGroup.get('customer.lastName'); }
  get email() { return this.chekoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.chekoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.chekoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressStates() { return this.chekoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.chekoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.chekoutFormGroup.get('shippingAddress.zipCode'); }
  
  get billingAddressStreet() { return this.chekoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.chekoutFormGroup.get('billingAddress.city'); }
  get billingAddressStates() { return this.chekoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.chekoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.chekoutFormGroup.get('billingAddress.zipCode'); }

  get creditcardType() { return this.chekoutFormGroup.get('creditCard.cardType'); }
  get creditcardNameOfcard() { return this.chekoutFormGroup.get('creditCard.nameOnCard'); }
  get creditcardSecurityCode() { return this.chekoutFormGroup.get('creditCard.securityCode'); }
  get creditcardCardNumber() { return this.chekoutFormGroup.get('creditCard.cardNumber'); }

  onSubmit() {
    console.log("Handling the submit button");

    if (this.chekoutFormGroup.invalid) {
      this.chekoutFormGroup.markAllAsTouched();
    }

    console.log(this.chekoutFormGroup.get('customer')?.value);
    console.log("The email is " + this.chekoutFormGroup.get('customer')?.value.email);

    console.log("The shipping address country is " + this.chekoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping address state is " + this.chekoutFormGroup.get('shippingAddress')?.value.state.name);
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.chekoutFormGroup.controls['billingAddress']
        .setValue(this.chekoutFormGroup.controls['shippingAddress'].value);

      // fix copy state from option
      this.billingAddressState = this.shippingAddressState;

    } else {
      this.chekoutFormGroup.controls['billingAddress'].reset();

      // fix copy state from option
      this.billingAddressState = [];

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

  getState(formGroupName: string) {
    const formGroup = this.chekoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`countryCode: ${countryCode}, coutryName: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressState = data;
        } else {
          this.billingAddressState = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

}
