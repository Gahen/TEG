import { Input, Component } from '@angular/core';
import { Country } from 'src/type/country';

@Component({
  selector: 'country-info',
  templateUrl: "./countryInfo.component.html",
})
export class CountryInfoComponent {
  @Input() country: Country;

  constructor() {}
}


