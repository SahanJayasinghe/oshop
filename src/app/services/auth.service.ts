import { Injectable } from '@angular/core';
import { auth, User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './user.service';
import { AppUser } from '../models/app-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User>;

  constructor(private afAuth: AngularFireAuth, private route: ActivatedRoute, private router: Router, private userService: UserService) { 
    this.user$ = afAuth.authState;
  }

  login(): void {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    console.log(returnUrl);
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
    .then(response => {
      console.log(response);
      if (response.user) { this.userService.save(response.user); }
      this.router.navigateByUrl(returnUrl);
    })
    .catch(err => console.log(err));
  }

  logout(): void {
    this.afAuth.signOut().then(() => { this.router.navigateByUrl('/login') });
  }

  get appUser$(): Observable<AppUser> {
    return this.user$.pipe(
      switchMap( user => {
        if(user) return this.userService.get(user.uid).valueChanges();
        return of(null);
      }) )
  }
}
