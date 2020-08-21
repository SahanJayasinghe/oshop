import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppUser } from '../models/app-user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  appUser: AppUser;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.appUser$.subscribe(appUser => { 
      console.log(appUser);
      this.appUser = appUser;
    });
  }

  logout(): void {
    this.authService.logout()
  }
}
