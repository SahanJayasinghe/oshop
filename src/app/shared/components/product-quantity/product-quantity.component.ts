import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { CartItem } from 'src/app/shared/models/shopping-cart';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';

@Component({
  selector: 'app-product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.css']
})
export class ProductQuantityComponent implements OnInit {
  @Input('product') product: Product | CartItem;
  @Input('quantity') quantity: number;
  @Input('parent') parentComponent: string;

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit(): void {
  }

  addToCart() {
    if (this.product.key) this.cartService.addProduct(this.product);
  }

  removeFromCart() {
    if (this.product.key) this.cartService.removeProduct(this.product);
  }

}
