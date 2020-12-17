import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap, map } from 'rxjs/operators';
import { Product } from '../models/product';
import { ProductService } from './product.service';
import { SortColumn, SortDirection } from '../directives/sortable.directive';

interface SearchResult {
  products: Product[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  category: string;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(products: Product[], column: string, direction: string): Product[] {
  if (direction === '' || column === '') {
    return products;
  } else {
    return [...products].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(product: Product, term: string, pipe: PipeTransform) {
  return product.title.toLowerCase().includes(term.toLowerCase());
    // || pipe.transform(product.price).includes(term);
}

function chooseCategory(category: string, products: Product[]) {
  if(category === 'all') return products;
  return products.filter(c => c.category === category)
}

@Injectable({
  providedIn: 'root'
})
export class ProductsTableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _products$ = new BehaviorSubject<Product[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private PRODUCTS: Product[] = [];
  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    category: 'all'
  };

  constructor(private productService: ProductService, private pipe: DecimalPipe) {
    this.productService.getAll().snapshotChanges().pipe(
      map(productSnapshots => {
        return productSnapshots.map(snapshot => ({ key: snapshot.key, ...snapshot.payload.val() }))
      })
    )
    .subscribe(products => {
      console.log(products);
      this.PRODUCTS = products;    
      this._search$.pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      ).subscribe(result => {
        this._products$.next(result.products);
        this._total$.next(result.total);
      });
  
      this._search$.next();
    });

  }

  get products$() { return this._products$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get category() { return this._state.category}

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set category(category: string) { this._set({category}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm, category} = this._state;
    let filteredProducts = chooseCategory(category, this.PRODUCTS);
    // 1. sort
    let products = sort(filteredProducts, sortColumn, sortDirection);

    // 2. filter
    products = products.filter(product => matches(product, searchTerm, this.pipe));
    const total = products.length;

    // 3. paginate
    products = products.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({products: products, total});
  }
}
