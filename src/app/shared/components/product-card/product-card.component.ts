import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { ShoppingCart } from 'src/app/shared/models/shopping-cart';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit, OnChanges {
  @Input('product') product: Product;
  @Input('card-width') cardWidth: string;
  @Input('card-height') cardHeight: string;
  @Input('image-height') imgHeight: string;
  @Input('button-name') btnName: string;
  @Input('shopping-cart') cart: ShoppingCart;

  quantity = 0;
  
  constructor(private cartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.quantity = this.getQuantity();
  }

  ngOnChanges() {
    this.quantity = this.getQuantity();
    // console.log(`${this.product.title}: ${this.quantity}`);
  }

  addToCart() {
    if (this.product.key) this.cartService.addProduct(this.product);
  }

  removeFromCart() {
    if (this.product.key) this.cartService.removeProduct(this.product);
  }

  getQuantity() {
    if (!this.cart || !this.cart.items) return 0;
    let item = this.cart.items[this.product.key];
    return item ? item.quantity : 0;
  }

}
