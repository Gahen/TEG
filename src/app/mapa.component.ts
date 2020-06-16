import { Component, Input, OnInit, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import {Teg} from 'src/type/teg';
import {CountryId, Countries, Country} from 'src/type/country';

function resize(element: HTMLElement) {
  const scale = element.offsetWidth / element.querySelector('g').getBoundingClientRect().width;
  element.querySelector('g').setAttribute('transform', 'scale('+scale+')');
  element.parentElement.style.height = element.querySelector('g').getBoundingClientRect().height+'px';
}

@Component({
  selector: 'mapa',
  templateUrl: './mapa.svg',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit, OnChanges {
  @Input() teg: Teg;
  @Input() started: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.started.currentValue) {
      this.getElementsAsArray().forEach((el: SVGElement) => this.setOwnerColor(el));
    }
  }

  getElementsAsArray() {
    return [ ...this.el.nativeElement.querySelectorAll('[inkscape\\:label="paises"] g') ];
  }

  ngOnInit() {
    let last: SVGElement;
    let elements = this.getElementsAsArray();
    elements = elements.filter((el: SVGElement) => Countries.some(c => c.id === CountryId[el.getAttribute("id")]));

    const click = (event: any) => {
      event.preventDefault();
      if (!this.started) {
        return false;
      }
      const country = this.find(event.currentTarget.id);
      const lastCountry = this.find(last?.id);

      if (country) {
        this.teg.countryAction(country);
        if (lastCountry !== this.teg.currentCountryFrom && lastCountry !== this.teg.currentCountryTo) {
          this.setOwnerColor(last);
        }
        last = event.currentTarget;
        last.setAttribute('class', 'active');
        this.setArmies(last)
      }

    };

    elements.forEach((el: SVGElement) => {
      this.renderer.listen(el, 'dblclick', (event) => event.preventDefault());
      this.renderer.listen(el, 'click', click);
    });

    resize(this.el.nativeElement);
  }

  find(countryId: string) {
    return this.teg.countries.find(el => el.id === CountryId[countryId]);
  }

  setArmies(el: SVGElement) {
    const country = this.find(el.getAttribute('id'));
    el.querySelectorAll('tspan')[1].textContent = `${country.armies}`;
  }

  setOwnerColor = (el: SVGElement) => {
    const country = this.find(el.getAttribute('id'));
    if (country) {
      // Texto y cantidad
      el.querySelector('tspan').textContent = country.getName();
      if (el.querySelectorAll('tspan').length < 2) {
        const p = el.querySelector('tspan');
        const offsetW = p.getBBox().width / 2;
        const offsetH = p.getBBox().height - 1;
        const clone = p.cloneNode() as SVGTSpanElement;
        clone.setAttribute("class","armies");
        clone.setAttribute('y', (parseFloat(clone.getAttribute('y')) + offsetH).toString());
        clone.setAttribute('x', (parseFloat(clone.getAttribute('x'))+offsetW).toString());
        el.querySelector('tspan').after(clone);
        this.renderer.listen(p, 'dblclick', (event) => event.preventDefault());
        this.renderer.listen(clone, 'dblclick', (event) => event.preventDefault());
      }

      el.setAttribute('class', country.owner?.color || '');

      if (country.armies) {
        this.setArmies(el)
      }

      el.querySelectorAll('tspan')[0].textContent = country.getName();
    }
  };
};
