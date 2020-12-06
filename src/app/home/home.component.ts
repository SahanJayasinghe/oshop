import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators'
import { Category } from '../models/category';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  PRODUCTS: {[key: string] : Product[]} = {}
  productIndex: {[key: string] : number} = {}
  CATEGORIES: Category[] = []
  data_received: boolean = false
  cart$: Observable<ShoppingCart>;

  constructor(private productService: ProductService, private categoryService: CategoryService, private cartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.getCategories().subscribe(categories => {
      // console.log(categories);
      this.CATEGORIES = categories;
      this.getProducts().subscribe(products => {
        // console.log(products);
        this.data_received = true;
        for (const cat of categories) {
          this.PRODUCTS[cat.key] = products.filter(p => p.category === cat.key);
          this.productIndex[cat.key] = 0;
        }
      })
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

  getCategories(): Observable<Category[]> {
    return this.categoryService.getAll().snapshotChanges().pipe(
      map(categorySnapshots => {
        return categorySnapshots.map(snapshot => ({ key: snapshot.key, ...snapshot.payload.val() }))
      })
    )
  }

  slideRight(key: string): void {
    if (this.productIndex[key] === this.PRODUCTS[key].length - 3) return
    this.productIndex[key] += 1;
  }

  slideLeft(key: string) {
    if (this.productIndex[key] === 0) return
    this.productIndex[key] -= 1;
  }

}
