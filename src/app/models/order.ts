import { ShoppingCart } from './shopping-cart';

export class Order {
  key?: string;
  datePlaced: number;
  items: OrderItem[];
  totalPrice: number;

  constructor(public userId, public shipping: ShippingDetails, cart: ShoppingCart) {
    this.datePlaced = new Date().getTime();
    this.items = cart.getItemsArray().map(item => {
      return {      
        product: { title: item.title, price: item.price, imageUrl: item.imageUrl },
        quantity: item.quantity
      }  
    })
    this.totalPrice = cart.getTotalPrice();
  }

}

export interface OrderItem {
  product: {
    title: string;
    price: number;
    imageUrl: string;
  }
  quantity: number;
}

export interface ShippingDetails {
  name: string;
  line1: string;
  line2: string;
  city: string;
}