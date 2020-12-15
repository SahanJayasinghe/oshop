import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../models/order';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  authSubscription: Subscription;

  constructor(private orderService: OrderService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.appUser$.subscribe(appUser => {
      this.getUserOrders(appUser.id).subscribe(orders => this.orders = orders)
    })
  }

  getUserOrders(uid: string): Observable<Order[]> {
    return this.orderService.getByUserId(uid).snapshotChanges().pipe(
      map(orderSnaps => {
        return orderSnaps.map(snapshot => ({ key: snapshot.key, ...snapshot.payload.val() }))
      })
    )
  }

  getItemCount(order: Order) {
    if (order.items.length === 0) return 0;
    let count = 0;
    for (const item of order.items) {
      count += item.quantity;
    }
    return count;
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}
