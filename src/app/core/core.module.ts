import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';

import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [    
    NavBarComponent,
    HomeComponent,    
    LoginComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    CoreRoutingModule
  ],
  exports: [
    NavBarComponent,
  ]
})
export class CoreModule { }
