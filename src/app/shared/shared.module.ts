import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SortableHeader } from './directives/sortable.directive';

import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ProductQuantityComponent } from './components/product-quantity/product-quantity.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { AuthGuard } from './services/auth-guard.service';
import { ProductsTableService } from './services/products-table.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import { OrderService } from './services/order.service';

@NgModule({
  declarations: [
    ProductCardComponent,
    ProgressBarComponent,
    ProductQuantityComponent,
    OrderDetailsComponent,
    SortableHeader,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProductCardComponent,
    ProgressBarComponent,
    ProductQuantityComponent,
    OrderDetailsComponent,
    SortableHeader,    
  ],
  providers: [    
    AuthService,
    UserService,
    CategoryService,
    ProductService,
    AuthGuard,
    ProductsTableService,
    ShoppingCartService,
    OrderService
  ]
})
export class SharedModule { }
