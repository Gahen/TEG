import {Color} from 'src/type/color';
import * as _ from 'lodash';
import {ICard, allCardTypes, isCard} from 'src/type/card';
import {Country, isCountry} from 'src/type/country';
import {IObjective} from 'src/type/objective';

export class Player {
  cardTrades = 0;
  countries: Country[] = [];
  cards: ICard[] = [];
  armies = 0;
  objective: IObjective;
  usedCards: ICard[] = [];

  constructor(public name: string, public color: Color) {
  }

  validTradeCards(cards: ICard[]) {
    var cardTypes = _.map(cards, 'type');
    var are3 = cards.length === 3;
    var allDifferent = are3 && allCardTypes.every((t) => cardTypes.includes(t));
    var allOwn = are3 && cards.every(c => this.cards.indexOf(c) !== -1);

    return allDifferent && allOwn;
  }

  getCountries() {
    return this.countries;
  }

  hasCountry(country: Country) {
    return this.countries.includes(country);
  }

  addCountry(country: Country) {
    this.armies++;
    this.countries.push(country);
  }

  removeCountry(country: Country) {
    this.countries = _.without(this.countries, country);
  }

  addArmies(extraArmies: number) {
    this.armies += extraArmies;
  }

  removeArmy() {
    this.armies--;
  }

  getArmies() {
    return this.armies;
  }

  addCard(card: ICard) {
    this.cards.push(card);
  }

  getCards() {
    return this.cards;
  }

  hasCard(card: ICard) {
    return this.cards.includes(card);
  }

  canUseCard(countryOrCard: Country | ICard) {
    let card = this.findCard(countryOrCard);
    return !!(card && !this.usedCards.find(c => c.id === card.id ));
  }

  findCard(countryOrCard: Country | ICard): ICard | null {
    if (isCard(countryOrCard)) {
      return this.hasCard(countryOrCard) ? countryOrCard : null;
    } else if (isCountry(countryOrCard)){
      return this.cards.find(c => c.id === countryOrCard.id) || null;
    }
  }

  useCard(countryOrCard: Country | ICard) {
    let card = this.findCard(countryOrCard);

    if (!card) {
      throw new Error('Invalid card');
    } else if (!this.canUseCard(card)) {
      throw new Error('Can\'t use a card twice');
    } else {
      this.usedCards.push(card);
    }
  }

  tradeCards(cardsToBeUsed: ICard[]) {
    if (!this.validTradeCards(cardsToBeUsed)) {
      throw new Error('invalid cards to trade');
    } else {
      this.cards = _.difference(this.cards, cardsToBeUsed);
      this.cardTrades++;
    }
  }

  setObjective(o: IObjective) {
    this.objective = o;
  }

  getObjective() {
    return this.objective;
  }
}
