import { Component, OnChanges, Input, OnInit, ElementRef, Renderer2, SimpleChanges, HostListener } from '@angular/core';
import {Teg} from 'src/type/teg';
import {CountryId, Countries} from 'src/type/country';

function resize(element: HTMLElement) {
  var scale = element.offsetWidth / element.querySelector('g').getBoundingClientRect().width;
  element.querySelector('g').setAttribute('transform', 'scale('+scale+')');
  element.parentElement.style.height = element.querySelector('g').getBoundingClientRect().height+'px';
}

@Component({
  selector: 'mapa',
  templateUrl: './mapa.svg',
})
export class MapaComponent implements OnInit, OnChanges {
  @Input() teg: Teg;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    // this.setOwnerColor(changes);
  }

  ngOnInit() {
    let last: HTMLElement;
    let elements = this.el.nativeElement.querySelectorAll('g g g');
    this.renderer.listen(elements, 'dblclick', (event) => event.preventDefault());
    this.renderer.listen(elements, 'click', (event) => {
      event.preventDefault();
      var country = this.find(event.currentTarget.id);
      if (country) {
        this.teg.countryAction(country);
      }

      if (last) {
        this.setOwnerColor(last);
      }
      last = event.currentTarget;

      last.setAttribute('class', 'active');
    });

    elements.forEach((el: HTMLElement) => this.setOwnerColor(el));
  }

  find(countryId: CountryId) {
    return Countries.find(el => el.id === countryId);
  }

  setOwnerColor = (c: HTMLElement) => {
    var country = this.find(CountryId[c.getAttribute('id')]);
    var el = this.el.nativeElement;
    if (country) {
      // Texto y cantidad
      el.querySelector('tspan').innerText = country.getName();
      if (el.find('tspan').length < 2) {
        var p = el.find('tspan').eq(0);
        var clone = p.clone();
        clone.attr('y', parseFloat(clone.attr('y'))+6);
        clone.attr('x', parseFloat(clone.attr('x'))+p[0].offsetWidth/2 - 3);
        clone.text('');
        el.find('tspan').after(clone);
      }

      if  (country.armies) {
        el.find('tspan').eq(1).text('('+country.armies+')');
      }

      // nombres
      el.nativeElement.querySelector('tspan').innerText = country.getName();
    }

    resize(el);
  };

  @HostListener('window:resize')
  onResize() {
    resize(this.el.nativeElement)
  }

};
