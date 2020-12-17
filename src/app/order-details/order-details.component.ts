import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Order } from '../shared/models/order';
import { OrderService } from '../shared/services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  id: string;
  order: Order;

  constructor(private orderService: OrderService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.orderService.get(this.id).valueChanges().pipe(take(1)).subscribe(order => {
      this.order = order;
      console.log(this.route.snapshot.parent)
    })
  }

}
