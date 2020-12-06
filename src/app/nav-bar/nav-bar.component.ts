import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppUser } from '../models/app-user';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  appUser: AppUser;
  cart$: Observable<ShoppingCart>;

  constructor(private authService: AuthService, private cartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.authService.appUser$.subscribe(appUser => { 
      console.log(appUser);
      this.appUser = appUser;
      this.cartService.initializeCart(appUser);
    });
    this.cart$ = this.cartService.Cart$;
  }

  logout(): void {
    this.authService.logout()
  }
}
