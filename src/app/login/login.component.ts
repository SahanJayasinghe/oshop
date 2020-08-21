import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError: string;
  
  constructor(private authService: AuthService) { this.loginError = null; }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.login();
  }

}
