import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { AppUser } from '../shared/models/app-user';
import { ShoppingCartService } from '../shared/services/shopping-cart.service';
import { ShoppingCart } from '../shared/models/shopping-cart';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  appUser: AppUser;
  cart$: Observable<ShoppingCart>;

  constructor(private authService: AuthService, private cartService: ShoppingCartService, public router: Router, private route: ActivatedRoute) {}

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
