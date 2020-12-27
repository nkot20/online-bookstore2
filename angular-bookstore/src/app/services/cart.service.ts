import { CartItem } from './../common/cart-item';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  CartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCard(theCartItem: CartItem) {
    //check whether book/item is already int the cart
    let alreadyExistsIncart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.CartItems.length > 0) {
      //find the book/item in the based cart based on the id
      existingCartItem = this.CartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      alreadyExistsIncart = (existingCartItem !== undefined);
    }

    if (alreadyExistsIncart) {
      //increment the quantity
      existingCartItem.quantity++;
    }else {
      //add to the cart item array
      this.CartItems.push(theCartItem);
    }

    this.calculateTotalPrice();
  }
  calculateTotalPrice() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    //calculate the total price  and total quantity
    for (let currentCartItem of this.CartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    console.log(`total price: ${totalPriceValue}, Total quantity: ${totalQuantityValue}`);

    //publish the events 
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

  }
}
