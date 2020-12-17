import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ShoppingRoutingModule } from './shopping-routing.module';

import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { ProductsComponent } from './components/products/products.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { CategoryListComponent } from './components/products/category-list/category-list.component';
import { ShippingFormComponent } from './components/check-out/shipping-form/shipping-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ShoppingCartComponent,
    ProductsComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    CategoryListComponent,
    ShippingFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ShoppingRoutingModule
  ],
})
export class ShoppingModule { }
