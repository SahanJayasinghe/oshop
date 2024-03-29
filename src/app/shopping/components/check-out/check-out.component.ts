import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ShoppingCart } from 'src/app/shared/models/shopping-cart';
import { Order, ShippingDetails } from 'src/app/shared/models/order';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppUser } from 'src/app/shared/models/app-user';
import { OrderService } from 'src/app/shared/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit, OnDestroy {
  appUser: AppUser
  cart: ShoppingCart;
  cartSubscription: Subscription;
  authSubscription: Subscription;
  
  constructor(private authService: AuthService, private cartService: ShoppingCartService, private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.appUser$.subscribe(appUser => { this.appUser = appUser })
    this.cartSubscription = this.cartService.Cart$.subscribe(cart => this.cart = cart);
  }

  placeOrder(shipping: ShippingDetails) {
    console.log(shipping)
    let order = new Order(this.appUser.id, shipping, this.cart);
    console.log(order)
    this.orderService.create(order).then(result => {
      console.log(result.key)
      this.cartService.clearCart()
      this.router.navigateByUrl(`/order-success/${result.key}`)
    })
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }

}
