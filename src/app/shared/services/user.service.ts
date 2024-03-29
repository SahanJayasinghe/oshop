import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { User } from 'firebase';
import { AppUser } from '../models/app-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  get(uid: string): AngularFireObject<AppUser> {
    return this.db.object(`/users/${uid}`);
  }

  save(user: User) {
    this.db.object(`/users/${user.uid}`).update({
      name: user.displayName,
      email: user.email
    });
  }

  assignCart(uid: string, cartId: string) {
    return this.db.object(`/users/${uid}`).update({cartId});
  }
}
