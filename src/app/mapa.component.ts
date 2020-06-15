import { Component, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';
import {Teg} from 'src/type/teg';
import {CountryId, Countries} from 'src/type/country';

function resize(element: HTMLElement) {
  const scale = element.offsetWidth / element.querySelector('g').getBoundingClientRect().width;
  element.querySelector('g').setAttribute('transform', 'scale('+scale+')');
  element.parentElement.style.height = element.querySelector('g').getBoundingClientRect().height+'px';
}

@Component({
  selector: 'mapa',
  templateUrl: './mapa.svg',
})
export class MapaComponent implements OnInit {
  @Input() teg: Teg;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    let last: HTMLElement;
    let elements = [ ...this.el.nativeElement.querySelectorAll('g g g') ];
    elements = elements.filter((el: HTMLElement) => Countries.some(c => c.name.toLowerCase() === el.id));

    const click = (event: any) => {
      event.preventDefault();
      const country = Countries.find(c => c.name.toLowerCase() === event.currentTarget.id);
      if (country) {
        this.teg.countryAction(country);
      }

      if (last) {
        this.setOwnerColor(last);
      }
      last = event.currentTarget;

      last.setAttribute('class', 'active');
    };

    elements.forEach((el: HTMLElement) => {
      this.renderer.listen(el, 'dblclick', (event) => event.preventDefault());
      this.renderer.listen(el, 'click', click);
    });

    elements.forEach((el: HTMLElement) => this.setOwnerColor(el));
  }

  find(countryId: CountryId) {
    return Countries.find(el => el.id === countryId);
  }

  setOwnerColor = (c: HTMLElement) => {
    const country = this.find(CountryId[c.getAttribute('id')]);
    const el = this.el.nativeElement;
    if (country) {
      // Texto y cantidad
      el.querySelector('tspan').innerText = country.getName();
      if (el.querySelector('tspan').length < 2) {
        const p = el.querySelector('tspan');
        const clone = p.clone();
        clone.setAttribute('y', parseFloat(clone.attr('y'))+6);
        clone.setAttribute('x', parseFloat(clone.attr('x'))+p[0].offsetWidth/2 - 3);
        clone.innerText = '';
        el.querySelector('tspan').after(clone);
      }

      if  (country.armies) {
        el.querySelectorAll('tspan')[1].innerText = '('+country.armies+')';
      }

      // nombres
      el.querySelector('tspan').innerText = country.getName();
    }

    resize(el);
  };

  /*
  @HostListener('window:resize')
  onResize() {
    resize(this.el.nativeElement)
  }
  */

};
