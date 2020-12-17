import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFireDatabase) { }

  create(order: Order) {
    return this.db.list<Order>('/orders').push(order)
  }

  getAll() {
    return this.db.list<Order>('/orders')
  }

  getByUserId(uid: string) {
    return this.db.list<Order>('/orders', query => {
      return query.orderByChild('userId').equalTo(uid)
    })
  }

  get(id: string) {
    return this.db.object<Order>(`/orders/${id}`)
  }
}
