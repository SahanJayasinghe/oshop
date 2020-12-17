import { Product } from './product';

export class ShoppingCart {
  key?: string;
  items: {[key: string]: CartItem};
  // dateCreated?: number;
  // totalQuantity?: number;

  constructor(items: {[key: string]: CartItem}, public dateCreated?: number) {
    this.items = (items) ? items : {};
  }

  get totalQuantity() {
    let total = 0;
    if (!this.items) return 0;
    for (const key of Object.keys(this.items)) {
      total += this.items[key].quantity;
    }
    return total;
  }

  getItemKeys() {
    if (!this.items) return [];
    return Object.keys(this.items);
  }

  hasItems(): boolean {
    if (!this.items) return false;
    return Object.keys(this.items).length !== 0;
  }

  getItemsArray(): CartItem[] {
    let itemsArr: CartItem[] = [];
    if (!this.items) return [];
    for (const key of Object.keys(this.items)) {
      itemsArr.push(this.items[key])
    }
    return itemsArr;
  }

  getTotalPrice() {
    let total = 0;
    if (!this.items) return 0;
    for (const key of Object.keys(this.items)) {
      total += this.items[key].price * this.items[key].quantity;
    }
    return total;
  }
}

export interface CartItem {
  // product: Product;
  key?: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}