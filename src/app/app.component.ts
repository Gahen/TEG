import { Component } from '@angular/core';
import { Teg } from "src/type/teg"
import {Color} from 'src/type/color';
import {gameState} from 'src/type/states';
import {allCardTypes, ICard} from 'src/type/card';

const isColor = (color: Color | string): color is Color => Object.values(Color).some(v => v === color);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngTEG';
  TEG = new Teg();
  states = gameState;
  newPlayerName = "";
  newPlayerColor = "";
  armies = "";

  addPlayer() {
    if (isColor(this.newPlayerColor)) {
      this.TEG.addPlayer(this.newPlayerColor as Color, this.newPlayerName);
    }
  }

  canTrade3Cards() {
    const cards = this.TEG.currentPlayer.getCards().filter(c => c.active);
    let res = false;

    if (cards.length === 3) {
      const allDifferent = allCardTypes
        .every(cardType => 1 === cards.reduce((accum, card) => card.type === cardType ? accum + 1 : accum, 0));

      const allSame = allCardTypes
        .every(cardType => cards.some(card => card.type === cardType));

      res = allDifferent || allSame;
    };
    return res;
  }

  trade() {
    const cards = this.TEG.currentPlayer.getCards().filter(c => c.active);
    this.TEG.trade3Cards(cards);
  }

  toggleActive(card: ICard) {
    card.active=!card.active;
  }
}
