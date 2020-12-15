import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrders().subscribe(orders => this.orders = orders)
  }

  getOrders(): Observable<Order[]> {
    return this.orderService.getAll().snapshotChanges().pipe(
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
  
}
