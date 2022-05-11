import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    // check if we already have the item in our cart
    let alreadyExitsInCart: boolean = false;
    let exitingCartItem!: CartItem;

    if (this.cartItems.length > 0) {
      // find the item in the cart base on item id

      exitingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;

    }

    // check if we found it
    alreadyExitsInCart = (exitingCartItem != null);

    if (alreadyExitsInCart) {
      // increment the quantity
      exitingCartItem.quantity++;
    } else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new value.. all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Content of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name : ${tempCartItem.name}, quantity : ${tempCartItem.quantity}, unit price : ${tempCartItem.unitPrice}, sub total price : ${subTotalPrice}`);
    }

    // toFixed(2) to digit after decimal ex: 128.98
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, total Quantity: ${totalQuantityValue}`)
    console.log('----------------')
  }

}

