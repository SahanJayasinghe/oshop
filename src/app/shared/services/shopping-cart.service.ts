import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AppUser } from '../models/app-user';
import { Product } from '../models/product';
import { ShoppingCart, CartItem } from '../models/shopping-cart';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private appUser: AppUser;
  // public cart$: Observable<ShoppingCart>;
  public cartId$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(private db: AngularFireDatabase, private userService: UserService, private route: ActivatedRoute) {}

  get Cart$(): Observable<ShoppingCart> {
    return this.cartId$.pipe(switchMap(cartId => {
      console.log(`get Cart$ method - cart Id: ${cartId}`);
      if (!cartId) return of(null)
      return this.db.object<ShoppingCart>(`/shopping-carts/${cartId}`).valueChanges().pipe(
        map(cart => new ShoppingCart(cart.items, cart.dateCreated))
      );
    }))
  }

  initializeCart(appUser: AppUser = null) {
    this.appUser = appUser;
    console.log(`initializeCart method - appUser: ${appUser}`)
    if (appUser) {
      this.initializeUserCart();
    }
    else {
      this.initializeLocalCart();
    }
  }
  
  clearCart() {
    this.removeItems(this.cartId$.value);
  }

  private initializeUserCart() {
    if (!this.appUser.cartId) {
      this.db.list('/shopping-carts').push({dateCreated: Date.now()}).then(result => {
        this.userService.assignCart(this.appUser.id, result.key).then(() => {
          this.appUser.cartId = result.key;
          console.log(`initializeUserCart method - appUser does not have a cartId - assigned cartId ${result.key}`)
          // call method to move local cart items to user cart
          this.populateUserCart();
        })
      })
    }
    else if (this.cartId$.value) {
      // console.log(`initializeUserCart method - appUser cartId : ${this.appUser.cartId}`)
      // call method to confirm on moving local items to cart and take action based on the response
      this.getCartbyId(this.appUser.cartId).pipe(take(1)).subscribe(userCart => {
        let checkoutLocal = this.route.snapshot.queryParamMap.get('localCart') && this.route.snapshot.queryParamMap.get('localCart') === 'true';
        if (userCart.getItemKeys().length !== 0 && !checkoutLocal) {
          console.log(`initializeUserCart method - appUser cart ${this.appUser.cartId} has items`)
          this.populateUserCart(true);
        }
        else {
          (!checkoutLocal)
           ? console.log(`initializeUserCart method - appUser cart '${this.appUser.cartId}' is empty`)
           : console.log(`initializeUserCart method - user checkout local cart`)
          this.populateUserCart();
          // this.cartId$.next(this.appUser.cartId)
        }
      })
    }
    else {
      this.cartId$.next(this.appUser.cartId);
      console.log(`initializeUserCart method - app started with a logged in user - Behavior subject cartId$ is set to '${this.cartId$.value}'`)
    }
  }

  private initializeLocalCart() {
    if (!localStorage.getItem('cartId')) {
      this.db.list('/shopping-carts').push({dateCreated: Date.now()}).then(result => {
        localStorage.setItem('cartId', result.key);
        this.cartId$.next(result.key)
        console.log(`initializeLocalCart method - localStorage does not have a cartId - assigned '${this.cartId$.value}' to behavior subject cartId$`)
      })
    }
    else {
      // call method to populate local cart with previously logged in user's cart items
      if (this.cartId$.value) {
        console.log(`initializeLocalCart method - cartId$ behavior subject has value '${this.cartId$.value}' from previously logged in user`)
        this.populateLocalCart()
        // this.cartId$.next(localStorage.getItem('cartId'))
      }
      else {
        this.cartId$.next(localStorage.getItem('cartId'))
        console.log(`initializeLocalCart method - cartId$ behavior subject is null - now it is set to '${this.cartId$.value}'`)
      }
    }
  }

  private create() {
    if (this.appUser && !this.appUser.cartId) {
      this.db.list('/shopping-carts').push({dateCreated: Date.now()}).then(result => {
        this.userService.assignCart(this.appUser.id, result.key)
      })
    }
    if (!localStorage.getItem('cartId')) {
      this.db.list('/shopping-carts').push({dateCreated: Date.now()}).then(result => {
        localStorage.setItem('cartId', result.key)
      })
    }
  }

  private getCartId() {
    if (this.appUser) return this.appUser.cartId;
    return localStorage.getItem('cartId');
  }

  // getCart() {
  //   let cartId = this.getCartId();
  //   console.log(`cart Id: ${cartId}`);
  //   return this.db.object<ShoppingCart>(`/shopping-carts/${cartId}`)
  // }

  private getItem(cartId: string, productId: string) {
    return this.db.object<CartItem>(`/shopping-carts/${cartId}/items/${productId}`);
  }

  private setItems(cartId: string, items: {[key: string]: CartItem}) {
    return this.db.object<{[key: string]: CartItem}>(`/shopping-carts/${cartId}/items`).set(items);
  }
  
  private removeItems(cartId: string) {
    return this.db.object<{[key: string]: CartItem}>(`/shopping-carts/${cartId}/items`).remove()
  }

  private deleteCart(cartId: string) {
    return this.db.object<ShoppingCart>(`/shopping-carts/${cartId}`).remove()
  }

  addProduct(product: Product|CartItem) {
    let cartId = this.getCartId();
    let item$ = this.getItem(cartId, product.key);
    item$.valueChanges().pipe(take(1)).subscribe((item: CartItem) => {
      if (item) item$.update({quantity: item.quantity + 1})
      else item$.set({title: product.title, price: product.price, imageUrl: product.imageUrl, quantity: 1})
    })
  }

  removeProduct(product: Product|CartItem) {
    let cartId = this.getCartId();
    let item$ = this.getItem(cartId, product.key);
    item$.valueChanges().pipe(take(1)).subscribe((item: CartItem) => {
      if (item && item.quantity === 1) item$.remove();
      else if (item && item.quantity > 1) item$.update({quantity: item.quantity - 1});
    })
  }

  private haveItems(cartId: string) {
    return this.db.object<ShoppingCart>(`/shopping-carts/${cartId}`).snapshotChanges().pipe(
      map(cartSnap => cartSnap.payload.hasChild('items') && Object.keys(cartSnap.payload.val().items).length !== 0)
    )
  }

  private getCartbyId(id: string) {
    return this.db.object<ShoppingCart>(`/shopping-carts/${id}`).valueChanges().pipe(
      map(cart => new ShoppingCart(cart.items, cart.dateCreated))
    );
  }

  private mergeCarts(localCartId: string, userCartId: string) {
    this.getCartbyId(localCartId).pipe(take(1)).subscribe(localCart => {
      if (!localCart.getItemKeys().length) {
        this.deleteCart(localCartId);
        localStorage.setItem('cartId', userCartId);
      }
      else {
        this.getCartbyId(userCartId).pipe(take(1)).subscribe(userCart => {
          for (const key of localCart.getItemKeys()) {
            if (userCart.getItemKeys().includes(key)) userCart.items[key].quantity += localCart.items[key].quantity;
            else userCart.items[key] = localCart.items[key];
          }
          this.setItems(userCartId, userCart.items).then(() => {
            this.deleteCart(localCartId);
          });
        })
      }
    })
  }

  private populateUserCart(userCartHasItems = false) {
    let localCartId = localStorage.getItem('cartId');
    let msg = "There are items in the cart from your last logged in session. Do you want to replace those with the local items ?";

    this.getCartbyId(localCartId).pipe(take(1)).subscribe(localCart => {
      if (localCart.getItemKeys().length !== 0 && userCartHasItems) {
        confirm(msg)
          ? this.setItems(this.appUser.cartId, localCart.items).then(() => this.cartId$.next(this.appUser.cartId))
          : this.cartId$.next(this.appUser.cartId);
      }
      else if(localCart.getItemKeys().length !== 0 && !userCartHasItems) {
        console.log(`populateUserCart else if`)
        this.setItems(this.appUser.cartId, localCart.items).then(() => {
          console.log(`user cart ${this.appUser.cartId} updated with local cart items`)
          this.cartId$.next(this.appUser.cartId)
        });
      }
      else this.cartId$.next(this.appUser.cartId);
    })
  }

  private populateLocalCart() {
    let localCartId = localStorage.getItem('cartId');
    this.getCartbyId(this.cartId$.value).pipe(take(1)).subscribe(userCart => {
      console.log("populateLocalCart method - user cart : ", userCart)
      if (userCart.getItemKeys().length !== 0) {
        this.setItems(localCartId, userCart.items).then(() => {
          console.log(`populateLocalCart method - local cart ${localCartId} updated with user cart items`)
          this.cartId$.next(localCartId)
        });
      }
      else {
        this.removeItems(localCartId).then(() => {
          console.log(`populateLocalCart method - removed all items from local cart ${localCartId}`)
          this.cartId$.next(localCartId)
        });
      }
    })
  }
}
