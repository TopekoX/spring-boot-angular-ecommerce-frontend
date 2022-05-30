import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidator } from 'src/app/validators/shop-validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYear: number[] = [];
  creditCardMonth: number[] = [];

  countries: Country[] = [];
  shippingAddressState: State[] = [];
  billingAddressState: State[] = [];

  storage: Storage = sessionStorage;

  // init Stripe API
  stripe = Stripe(environment.stripePublishKey); // var global from file typing.d.ts

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = {};


  constructor(private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    // setup stripe payment form
    this.setupStripePaymentForm();

    this.reviewCartDetail();

    // read the user email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhiteSpace]),
        email: new FormControl(theEmail, [Validators.required, Validators.pattern(
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
        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$'), ShopValidator.notOnlyWhiteSpace]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$'), ShopValidator.notOnlyWhiteSpace]),
        expirationMonth: [''],
        expirationYear: ['']
        */
      })
    });

    /*
    // populate credit card month
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth = " + startMonth);

    this.shopFormService.getCreditCardMonth(startMonth).subscribe(
      data => {
        console.log("Retrieve Credit Card Month: " + JSON.stringify(data));
        this.creditCardMonth = data;
      }
    );

    // populate credit card year
    this.shopFormService.getCreditCardYear().subscribe(
      data => {
        console.log("Retrieve Credit Card Year: " + JSON.stringify(data));
        this.creditCardYear = data;
      }
    )
    */

    // populate country
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieve Countries : " + JSON.stringify(data));
        this.countries = data;
      }
    )
  }

  setupStripePaymentForm() {
    // get handle a stripe elements
    var elements = this.stripe.elements();

    // create a card element.. and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event) => {

      // get a handle to card-errors element
      this.displayError = document.getElementById("card-errors");

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        // show validation error message to customer
        this.displayError.textContent = event.error.message;
        console.log("this.displayError.textContent : " + this.displayError.textContent)
      }
    });
  }

  reviewCartDetail() {
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressStates() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressStates() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditcardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditcardNameOfcard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditcardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditcardCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }

  onSubmit() {
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart item
    const cartItem = this.cartService.cartItems;

    // create order item

    // 1. long way
    /*
    let orderItems: OrderItem[] = [];

    for (let i = 0; i < cartItem.length; i++) {
      orderItems[i] = new OrderItem(cartItem[i]);
    }
    */

    // 2. short way
    let orderItems: OrderItem[] = cartItem.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItem
    purchase.order = order;
    purchase.orderItems = orderItems;

    // compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'USD';

    console.log(`this.paymentInfo.amount = ${this.paymentInfo.amount}`);

    // if valid from then
    // - create payment intent
    // - confirm card payment
    // - place order
    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement
              }
            }, { handeAction: false }
          ).then(function(result) {
              if (result.error) {
                // info the customer there was an error
                alert(`There was an error ${result.error.message}`);
              } else {
                // Call REST API via the checkoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: response => {
                    alert(`Your order has been received ;) \nOrder tracking number: ${response.orderTrackingNumber}`);

                    // reset Card
                    this.resetCart();
                  },
                  error: err => {
                    alert(`There was an error: ${err.message}`);
                  }
                });
              }
          }.bind(this));
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    
     // updates storage with latest state of the cart
    this.cartService.persistCartItems();

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate to the product page
    this.router.navigateByUrl('/products');
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // fix copy state from option
      this.billingAddressState = this.shippingAddressState;

    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // fix copy state from option
      this.billingAddressState = [];

    }
  }

  handleMonthAndYear() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
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
    const formGroup = this.checkoutFormGroup.get(formGroupName);

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
