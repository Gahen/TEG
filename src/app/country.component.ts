import { Input, Directive, OnChanges, OnInit, ElementRef, SimpleChanges, HostListener } from '@angular/core';
import {Countries, Country, CountryId} from 'src/type/country';
import {Teg} from 'src/type/teg';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[country]',
})
export class CountryComponent implements OnInit {
  @Input() teg: Teg;
  @Input("country") id: string;
  gameStarted = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.querySelector('tspan').textContent = Countries.find(c => c.id === CountryId[this.id]).getName();
    this.teg.gameStarted.subscribe((started => {
      if (started) {
        this.setArmies();
      }
      this.gameStarted = started;
    }))
    this.teg.countryChanged
      .pipe(filter(country => country?.id === CountryId[this.id]))
      .subscribe(() => {
        this.setArmies();
      });
  }

  get country() {
    return this.teg.countries.find(el => el.id === CountryId[this.id]);
  }

  @HostListener('dblclick', ['$event']) onDoubleClick(event: Event) {
    event.preventDefault();
  }

  @HostListener('click', ['$event']) onClick(event: Event) {
    event.preventDefault();
    if (!this.gameStarted) {
      return false;
    }
    this.teg.countryAction(this.country);
    this.setArmies()
  }

  setArmies() {
    const el = this.el.nativeElement;
    if (el.querySelectorAll('tspan').length < 2) {
      const p = el.querySelector('tspan');
      const offsetW = p.getBBox().width / 2;
      const offsetH = p.getBBox().height - 1;
      const clone = p.cloneNode() as SVGTSpanElement;
      clone.setAttribute("class","armies");
      const newY = parseFloat(p.getAttribute('y'))+offsetH;
      const newX = parseFloat(p.getAttribute('x'))+offsetW;
      clone.setAttribute('y', (newY).toString());
      clone.setAttribute('x', (newX).toString());
      p.after(clone);
    }
    if (this.country) {
      el.querySelectorAll('tspan')[1].textContent = `${this.country.armies}`;
    }
    const newClass = (this.isActive() ? "active " : "") + this.country?.owner?.color;
    this.el.nativeElement.setAttribute("class", newClass);
  }

  isActive() {
    return this.country && (this.country === this.teg.currentCountryTo || this.country === this.teg.currentCountryFrom);
  }
}

