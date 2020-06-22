import { Component, Input, OnInit, ElementRef, } from '@angular/core';
import {Teg} from 'src/type/teg';

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
export class MapaComponent implements OnInit {
  @Input() teg: Teg;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    resize(this.el.nativeElement);
  }
};
