import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem, ShoppingCart } from '../shared/models/shopping-cart';
import { ShoppingCartService } from '../shared/services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart$: Observable<ShoppingCart>;

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.cart$ = this.cartService.Cart$;
  }

  getItemWithKey(key:string, item:CartItem): CartItem {
    return {key, ...item}
  }

  clearCart() {
    this.cartService.clearCart()
  }

}
