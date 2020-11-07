import { Component, OnInit, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { SortableHeader, SortEvent} from '../../common/directives/sortable.directive';
import { ProductsTableService } from '../../services/products-table.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
  providers: [ProductsTableService, DecimalPipe]
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  // products: Product[];
  categories: Category[] = [];
  // filteredProducts: Product[];
  // subscription: Subscription;

  products$: Observable<Product[]>;
  total$: Observable<number>;

  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader>;

  constructor(public service: ProductsTableService, private productService: ProductService, private categoryService: CategoryService) {
    this.products$ = service.products$;
    this.total$ = service.total$;
  }  

  ngOnInit(): void {
    // this.subscription = this.productService.getAll().snapshotChanges().pipe(
    //   map(productSnapshots => {
    //     return productSnapshots.map(snapshot => ({ key: snapshot.key, ...snapshot.payload.val() }))
    //   })
    // )
    // .subscribe(products => {
    //   console.log(products);
    //   this.products = products;
    //   this.filteredProducts = products;
    // })

    this.categoryService.getCategories().snapshotChanges().pipe(
      map(categorySnapshots => {
        return categorySnapshots.map(snapshot => ({ key: snapshot.key, ...snapshot.payload.val() }))
      })
    )
    .subscribe(categories => {
      console.log(categories);
      this.categories = categories;
    })
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  onSort({column, direction}: SortEvent) {
    console.log({column, direction});
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  // filter(query: string, category: string) {
  //   // console.log({query, category});
  //   query = query.trim();
  //   if (query && category !== 'all') {
  //     this.filteredProducts = this.products.filter(p => {
  //       return (p.category === category) && p.title.toLowerCase().includes(query.toLowerCase())
  //     })
  //   }
  //   else if (query && category === 'all') {
  //     this.filteredProducts = this.products.filter(p => {
  //       return p.title.toLowerCase().includes(query.toLowerCase())
  //     })
  //   }
  //   else if (category !== 'all'){
  //     this.filteredProducts = this.products.filter(p => p.category === category);
  //   }
  //   else {
  //     this.filteredProducts = this.products;
  //   }
  //   // this.filteredProducts = (query) 
  //   // ? this.products.filter(p => {
  //   //     (p.key === category) && p.title.toLowerCase().includes(query.toLowerCase())
  //   //   })
  //   // : this.products.filter(p => {
  //   //     p.key === category
  //   //   });
  // }
}
