import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'
import { Product } from '../shared/models/product';
import { ShoppingCart } from '../shared/models/shopping-cart';
import { ProductService } from '../shared/services/product.service';
import { ShoppingCartService } from '../shared/services/shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string;
  cart$: Observable<ShoppingCart>;

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: ShoppingCartService) {}

  ngOnInit(): void {    
    this.getProducts().pipe(switchMap(products => {
      this.products = products;
      return this.route.queryParamMap
    }))
    .subscribe(params => {
      if (params.has('category')) this.selectedCategory = params.get('category');
      else this.selectedCategory = undefined;
      
      this.filteredProducts = (this.selectedCategory) ? this.products.filter(p => p.category === this.selectedCategory) : this.products
    })

    this.cart$ = this.cartService.Cart$;
  }

  getProducts(): Observable<Product[]> {
    return this.productService.getAll().snapshotChanges().pipe(
      map(productSnapshots => {
        return productSnapshots.map(snapshot => ({ key: snapshot.key, ...snapshot.payload.val() }))
      })
    )
  }

}
