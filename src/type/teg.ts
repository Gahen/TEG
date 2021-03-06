import {Color} from 'src/type/color';
import {gameState} from 'src/type/states';
import {Player} from 'src/type/player';
import {Cards, ICard} from 'src/type/card';
import * as _ from 'lodash';
import { timer, Subject, Observable } from 'rxjs';
import {Country, Countries} from 'src/type/country';
import {Objectives, ObjectiveTypes} from 'src/type/objective';
import Dice from 'src/type/dice';

const PERSIST_GAME_INTERVAL = 5000;

export class Teg {
  canTakeCard = false;
  time: number;
  tick: number;
  pendingPlayers: Player[] = [];
  players: Player[] = [];
  colors: Color[] = Object.values(Color);
  state = gameState.firstArmies;
  currentPlayer: Player;
  attacker: Player; // last attacking player
  defender: Player; // last defending player
  gameStartedSubject: Subject<boolean> = new Subject();
  gameStarted: Observable<boolean>;
  dices = []; // last pair of dices
  pendingArmies = 0;
  cards = Cards;
  tradedCards = [];
  countries: Country[] = [];

  currentCountryFrom: Country;
  currentCountryTo: Country;

  countryChanged: Observable<Country>;
  countryChangedSubject: Subject<Country> = new Subject();

  constructor() {
    this.gameStarted = this.gameStartedSubject.asObservable();
    this.countryChanged = this.countryChangedSubject.asObservable();

    if (localStorage.getItem('TEGdata')) {
      // this.parse(localStorage.getItem('TEGdata'));
    }

    timer(0, PERSIST_GAME_INTERVAL)
      .subscribe(() => {
        // localStorage.setItem('TEGdata', this.serialize());
      });
  }

  addPlayer(color: Color, name: string) {
    this.colors = this.colors.filter(c => c !== color);
    this.players.push(new Player(name, color));
  }

  removePlayer(player: Player) {
    this.players = _.remove(this.players, player);
    this.colors[player.color] = player.color;
  }

  start() {
    this.setCountries();
    this.setObjectives();
    this.currentPlayer = this.players[0];
    this.pendingPlayers = this.players.slice(1);
    this.pendingArmies = 5;
    this.gameStartedSubject.next(true);
    this.startTimer();
  }

  startTimer() {
    this.tick = (new Date()).getTime()+60*2*1000; // 2 minutes
    let sub = timer(0, 100)
      .subscribe(() =>  {
        this.time = this.tick - (new Date()).getTime();
        if (this.time <= 0) {
          this.changeTurn();
          sub.unsubscribe();
        }
      });
  }

  setCountries() {
    let cs = _.shuffle(Countries);
    let i = 0;
    _.each(cs, (c) => {
      i = i % this.players.length;
      c.owner = this.players[i];
      this.players[i++].addCountry(c);
      c.armies = 1;
      this.countries.push(c);
    });
  }

  setObjectives() {
    let objs = _.shuffle(Objectives.slice(0));
    _.each(this.players, function(p) {
      p.setObjective(objs.shift());
    });
  }

  takeCard() {
    if (this.canTakeCard) {
      this.cards = _.shuffle(this.cards);
      this.currentPlayer.addCard(this.cards.pop());
      this.canTakeCard = false;
    }
  }

  tradeCard(card: ICard) {
    let country = Country.find(card.id);
    const playerHasCountry = country && this.currentPlayer.hasCountry(country);
    if (playerHasCountry && this.currentPlayer.hasCard(card) && !this.isTradedCard(card)) {
      this.addArmies(country, 2);
      this.tradedCards.push(card);
    }
  }

  canAddArmies() {
    return [gameState.firstArmies, gameState.secondArmies, gameState.addArmies].indexOf(this.state) !== -1 && this.currentCountryFrom && this.currentPlayer.hasCountry(this.currentCountryFrom);
  }

  canRegroup() {
    let p = this.currentPlayer;
    if (!this.currentCountryTo || !this.currentCountryFrom) {
      return false;
    }
    let countryTo = this.extendCountry(this.currentCountryTo);
    let countryFrom = this.extendCountry(this.currentCountryFrom);
    return p && p.hasCountry(countryTo) && p.hasCountry(countryFrom) && countryTo.limitsWith(countryFrom) && (this.state === gameState.regroup || this.state === gameState.attack);
  }

  attempAction(q: string) {
    this._countryAction(this.currentCountryFrom, this.currentCountryTo, parseInt(q, 10));
  }

  regroup() {
    if (this.state === gameState.attack) {
      this.state = gameState.regroup;
    }
  }

  nextState() {
    switch (this.state) {
      case gameState.firstArmies:
        this.state = gameState.secondArmies;
      break;
      case gameState.secondArmies:
        this.state = gameState.attack;
      break;
      case gameState.attack:
      case gameState.afterCard:
      case gameState.regroup:
        this.state = gameState.addArmies;
      break;
      case gameState.addArmies:
        this.state = gameState.attack;
      break;
    }
  }

  extendCountry(country: Country) {
    let owner = _.find(this.players, function(p) {
      return p.hasCountry(country);
    });
    country.owner = owner;

    return country;
  }

  isPuttingArmies() {
    return [gameState.firstArmies, gameState.secondArmies, gameState.addArmies].includes(this.state);
  }

  countryAction(country: Country) {
    let picked1 = this.currentCountryFrom  && !this.currentCountryTo;
    let picked2 = !!(this.currentCountryFrom && this.currentCountryTo);
    const oldCountryFrom = this.currentCountryFrom;
    const oldCountryTo = this.currentCountryTo;

    if (picked1) {
      if (this.currentCountryFrom.id === country.id && this.isPuttingArmies()) {
        this._countryAction(this.currentCountryFrom);
      } else if (this.isPuttingArmies()) {
        this.currentCountryFrom = this.extendCountry(country);
      } else if (country.limitsWith(this.currentCountryFrom)) {
        if (this.currentCountryFrom.owner === this.currentPlayer 
            && (country.owner === this.currentPlayer && gameState.regroup === this.state
            || (country.owner !== this.currentPlayer && gameState.attack === this.state))) {
            this.currentCountryTo = this.extendCountry(country);
        } else {
          this.currentCountryFrom = this.extendCountry(country);
        }
      } else {
        this.currentCountryFrom = this.extendCountry(country);
      }
    }
    else if (picked2) {
      if (this.currentCountryTo.id === country.id) {
        this._countryAction(this.currentCountryFrom, this.currentCountryTo);
      } else {
        this.clearSelectedCountries();
      }
    } else { // || picked0
      this.currentCountryFrom = this.extendCountry(country);
    }

    // update all potentially changed countries
    this.countryChangedSubject.next(oldCountryTo);
    this.countryChangedSubject.next(oldCountryFrom);
    this.countryChangedSubject.next(country);
  }

  _countryAction(countryFrom: Country, countryTo: Country = null, q: number = 1) {
    let player = this.currentPlayer;
    switch (this.state) {
      case gameState.firstArmies:
      case gameState.secondArmies:
      case gameState.addArmies:
      if (player.hasCountry(countryFrom) && this.pendingArmies > 0) {
        while (q-- && this.pendingArmies--) {
          this.addArmies(countryFrom, 1);
        }
      }
      break;
      case gameState.attack:
      if (countryTo && countryTo.limitsWith(countryFrom) && !player.hasCountry(countryTo)) {
        this.attack(countryFrom, countryTo);
      }
      break; // if you cant attack maybe you are trying to regroup
      case gameState.regroup:
      if (this.canRegroup()) {
        while (q-- && countryFrom.armies > 1) {
          this.addArmies(countryTo, 1);
          this.removeArmy(countryFrom);
        }
        this.state = gameState.regroup;
      }
      break;
      case gameState.afterCard:
      if (player.hasCountry(countryFrom)) {
        if (player.canUseCard(countryFrom)) {
          this.addArmies(countryFrom, 1);
          player.useCard(countryFrom);
        }
      }
      break;
    }
  }

  useCard() {
  }

  canAttack() {
    if (!this.currentCountryTo || !this.currentCountryFrom) {
      return false;
    }
    let defendingCountry = this.currentCountryTo;
    let attackingCountry = this.currentCountryFrom;
    return attackingCountry.owner === this.currentPlayer &&
      defendingCountry.owner !== this.currentPlayer &&
      attackingCountry.armies > 1 && this.state === gameState.attack;
  }

  attack(attackingCountry: Country, defendingCountry: Country) {
    if (this.canAttack()) {

      this.attacker = this.currentPlayer;
      let defender = this.defender = _.find(this.players, function(p) {
        return p.hasCountry(defendingCountry);
      });

      let attackDices = Math.min(attackingCountry.armies-1, 3);
      let defenseDices = Math.min(defendingCountry.armies, 3);
      let dices = Dice.roll(attackDices, defenseDices);
      this.dices = dices;

      for (let i=0; i < dices[0].length && i < dices[1].length; i++) {
        if (defendingCountry.armies === 0) {
          break;
        }
        if (i < defenseDices && dices[0][i] > dices[1][i]) {
          // (dices[0][i] > dices[1][--defenseDices])
          this.removeArmy(defendingCountry);
        } else {
          this.removeArmy(attackingCountry);
        }
      }

      if (defendingCountry.armies === 0) {
        this.canTakeCard = true;
        defender.removeCountry(defendingCountry);
        this.currentPlayer.addCountry(defendingCountry);
        defendingCountry.setArmies(1);
        this.removeArmy(attackingCountry);

        // Si murió, entrego las cartas
        if (defender.getCountries().length === 0) {
        _.each(defender.getCards(), (c) => {
          this.currentPlayer.addCard(c);
        });
        }
      }

      this.checkIfWon(defender);
    }
  }

  changeTurn() {
    this.canTakeCard = false;
    this.checkIfWon();

    if (this.pendingPlayers.length === 0) {
      this.pendingPlayers = this.players.slice(1);
      this.pendingPlayers.push(this.players[0]);

      this.players = this.pendingPlayers.slice(0);
      this.nextState();
    }
    this.currentPlayer = this.pendingPlayers.shift();

    switch (this.state) {
      case gameState.firstArmies:
      this.pendingArmies = 5;
      break;
      case gameState.secondArmies:
      this.pendingArmies = 3;
      break;
      case gameState.addArmies:
      this.pendingArmies = Math.round(this.currentPlayer.getCountries().length/2);
      break;
      default:
      this.pendingArmies = 0;
      break;
    }

    this.clearSelectedCountries();

    this.startTimer();
  }

  clearSelectedCountries() {
    const cf = this.currentCountryFrom;
    const ct =  this.currentCountryTo;
    delete this.currentCountryFrom;
    delete this.currentCountryTo;
    this.countryChangedSubject.next(ct);
    this.countryChangedSubject.next(cf);
  }

  removeArmy(country: Country) {
    this.currentPlayer.removeArmy();
    country.removeArmies(1);
  }

  addArmies(country: Country, armies: number) {
    country.addArmies(armies);
  }

  checkIfWon(defender: Player = null) {
    let objective = this.currentPlayer.getObjective();
    // Objetivo común
    if (this.currentPlayer.getCountries().length >= 30) {
      this.gameEnded();
    }

    // Objetivo de destrucción
    if (defender && objective.type === ObjectiveTypes.DESTROY && !defender.getCountries().length) {
      if (objective.value === defender.color) {
        this.gameEnded(); // ganó
      }
      // objetivo de conquista
    } else if (objective.type === ObjectiveTypes.CONQUER) {
      let obj = {
        ...objective.value
      };
      _.each(this.currentPlayer.getCountries(), function(c) {
        if (obj[c.continent]) {
          obj[c.continent]--;
        }
      });
      if (_.every(obj, function(c) {
        return c <= 0;
      })) {
        this.gameEnded(); // ganó
      }
    }
  }
  gameEnded() {
    alert('game ended');
  }

  isTradedCard(card: ICard) {
    return this.tradedCards.includes(card);
  }

  trade3Cards(cards: ICard[]) {
    this.currentPlayer.tradeCards(cards);
    switch (this.currentPlayer.cardTrades) {
      case 1:
        this.pendingArmies += 4;
      break;
      case 2:
        this.pendingArmies += 7;
      break;
      case 3:
        this.pendingArmies += 10;
      break;
      default:
        this.pendingArmies += (this.currentPlayer.cardTrades-1)*5;
      break;
    }
  }
  serialize() {
    return JSON.stringify(this);
  }
};

