import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ShippingDetails } from 'src/app/models/order';

@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit {
  @Output('confirm') confirmation = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  submit(shipping: ShippingDetails) {
    this.confirmation.emit(shipping);
  }

}
