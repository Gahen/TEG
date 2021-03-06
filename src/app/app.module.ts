import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { MapaComponent } from './mapa.component';
import { CountryComponent } from './country.component';
import { CountryInfoComponent } from './countryInfo.component';
import { PlayerNameComponent } from './playerName.component';

@NgModule({
  declarations: [
    AppComponent,
    MapaComponent,
    CountryComponent,
    CountryInfoComponent,
    PlayerNameComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
