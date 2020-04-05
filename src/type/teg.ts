import {Color} from 'src/type/color';
import {gameState} from 'src/type/states';
import {Player} from 'src/type/player';
import {Cards} from 'src/type/card';
import * as _ from 'lodash';
import {timer} from 'rxjs';
import {take} from 'rxjs/operators';
import {CountryId} from 'src/type/country';
import {Objectives} from 'src/type/objective';

const saveInterval = 5000;

export class Teg {
  canTakeCard = false;
  time: number;
  tick: number;
  pendingPlayers: Player[] = [];
  players: Player[] = [];
  colors: Color[] = [];
  state = gameState.firstArmies;
  currentPlayer: Player;
  attacker: Player; // last attacking player
  defender: Player; // last defending player
  gameStarted = false;
  dices = []; // last pair of dices
  pendingArmies = 0;
  cards = Cards;
  tradedCards = [];

  constructor() {

    /*
    if (localStorage.getItem('TEGdata')) {
      this.parse(localStorage.getItem('TEGdata'));
    }
    */

    timer(saveInterval)
      .pipe(take(1))
      .subscribe(() => {
        // localStorage.setItem('TEGdata', this.serialize());
      });
  }

  addPlayer(color: Color, name: string) {
    this.colors = this.colors.filter(c => c === color);
    this.players.push(new Player(name, color));
  }

  removePlayer(player: Player) {
    this.players = _.remove(this.players, player);
    this.colors[player.color] = player.color;
  }

  start() {
    this.gameStarted = true;
    this.setObjectives();
    this.setCountries();
    this.currentPlayer = this.players[0];
    this.pendingPlayers = this.players.slice(1);
    this.pendingArmies = 5;
    this.startTimer();
  }

  startTimer() {
    this.tick = (new Date()).getTime()+60*2*1000; // 2 minutes
    var sub = timer(100)
      .pipe(take(1))
      .subscribe(() =>  {
        this.time = this.tick - (new Date()).getTime();
        if (this.time <= 0) {
          this.changeTurn();
          sub.unsubscribe();
        }
      });
  }

  setCountries() {
    const allCountries = Object.keys(CountryId);
    var cs = _.shuffle(allCountries);
    var i = 0;
    _.each(cs, function(c) {
      i = i % this.players.length;
      this.players[i++].addCountry(c);
    });
  }

  setObjectives() {
    var objs = _.shuffle(Objectives.slice(0));
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

  tradeCard(card: Card) {
    var country = this.currentPlayer.getCountry(card.countryId);
    if (country && this.currentPlayer.hasCard(card) && !this.isTradedCard(card)) {
      this.addArmies(country, 2);
      this.tradedCards.push(card);
    }
  }

  canAddArmies() {
    return [this.states.firstArmies, this.states.secondArmies, this.states.addArmies].indexOf(this.state) !== -1 && this.currentCountryFrom && this.currentPlayer.hasCountry(this.currentCountryFrom);
  }

  canRegroup() {
    var p = this.currentPlayer;
    if (!this.currentCountryTo || !this.currentCountryFrom) {
      return false;
    }
    var countryTo = this.extendCountry(this.currentCountryTo);
    var countryFrom = this.extendCountry(this.currentCountryFrom);
    return p && p.hasCountry(countryFrom) && p.hasCountry(countryFrom) && countryTo.limitsWith(countryFrom) && (this.state === states.regroup || this.state === states.attack);
  }

  attempAction(q) {
    this._countryAction(this.currentCountryFrom, this.currentCountryTo, q);
  }

  regroup() {
    if (this.state === states.attack) {
      this.state = states.regroup;
    }
  }

  nextState() {
    switch (this.state) {
      case states.firstArmies:
        this.state = states.secondArmies;
      break;
      case states.secondArmies:
        this.state = states.attack;
      break;
      case states.attack:
      case states.afterCard:
      case states.regroup:
        this.state = states.addArmies;
      break;
      case states.addArmies:
        this.state = states.attack;
      break;
    }
  }

  extendCountry(country) {
    var owner = _.find(this.players, function(p) {
      return p.hasCountry(country);
    });
    country.owner = owner;

    return country;
  }

  countryAction(country) {
    var picked1 = !!this.currentCountryFrom && !this.currentCountryTo;
    var picked2 = !!(this.currentCountryFrom && this.currentCountryTo);
    // var picked0 = !picked1 && !picked2;

    if (picked1 && this.currentCountryFrom.id === country.id) {
      this._countryAction(this.currentCountryFrom);
    }
    else if (picked1 && country.limitsWith(this.currentCountryFrom)) {
      this.currentCountryTo = this.extendCountry(country);
    }
    else if (picked2 && this.currentCountryTo.id === country.id) {
      this._countryAction(this.currentCountryFrom, this.currentCountryTo);
    } else { // || picked0
      this.currentCountryFrom = this.extendCountry(country);
      delete this.currentCountryTo;
    }
  }

  _countryAction(countryFrom, countryTo, q) {
    var p = this.currentPlayer;
    switch (this.state) {
      case states.firstArmies:
      case states.secondArmies:
      case states.addArmies:
      if (p.hasCountry(countryFrom) && this.pendingArmies > 0) {
        while (q-- && this.pendingArmies--) {
          this.addArmies(countryFrom, 1);
        }
      }
      break;
      case states.attack:
      if (countryTo && countryTo.limitsWith(countryFrom) && !p.hasCountry(countryTo)) {
        this.attack(countryFrom, countryTo, q);
      }
      break; // if you cant attack maybe you are trying to regroup
      case states.regroup:
      if (this.canRegroup()) {
        while (q-- && countryFrom.armies > 1) {
          this.addArmies(countryTo, 1);
          this.removeArmy(countryFrom);
        }
        this.state = states.regroup;
      }
      break;
      case states.afterCard:
      if (p.hasCountry(countryFrom)) {
        if (p.canUseCard(countryFrom)) {
          this.addArmies(countryFrom, 1);
          this.useCard(countryFrom);
        }
      }
      break;
    }
  }

  canAttack() {
    if (!this.currentCountryTo || !this.currentCountryFrom) {
      return false;
    }
    var defendingCountry = this.currentCountryTo;
    var attackingCountry = this.currentCountryFrom;
    return attackingCountry.owner === this.currentPlayer &&
      defendingCountry.owner !== this.currentPlayer &&
      attackingCountry.armies > 1 && this.state === states.attack;
  }

  attack(attackingCountry, defendingCountry, q) {
    if (this.canAttack()) {

      this.attacker = this.currentPlayer;
      var defender = this.defender = _.find(this.players, function(p) {
        return p.hasCountry(defendingCountry);
      });

      q = Math.min(3,q);

      var attackDices = Math.min(attackingCountry.armies-1, q);
      var defenseDices = Math.min(defendingCountry.armies, 3);
      var dices = Dice.roll(attackDices, defenseDices);
      this.dices = dices;

      for (var i=0; i < dices[0].length && i < dices[1].length; i++) {
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
        canTakeCard = true;
        defender.removeCountry(defendingCountry);
        this.currentPlayer.addCountry(defendingCountry);
        this.removeArmy(attackingCountry);

        // Si murió, entrego las cartas
        if (defender.getCountries().length === 0) {
        _.each(defender.getCards(), function(c) {
          this.currentPlayer.addCard(c);
        });
        }
      }

      this.checkIfWon(defender);
    }
  }

  changeTurn() {
    canTakeCard = false;
    this.checkIfWon();

    if (this.pendingPlayers.length === 0) {
      if (this.state !== states.attack) {
        this.pendingPlayers = this.players.slice(0);
      } else {
        this.pendingPlayers = this.players.slice(1);
        this.pendingPlayers.push(this.players[0]);

        this.players = this.pendingPlayers.slice(0);
      }
      this.nextState();
    }
    this.currentPlayer = this.pendingPlayers.shift();

    switch (this.state) {
      case states.firstArmies:
      this.pendingArmies = 5;
      break;
      case states.secondArmies:
      this.pendingArmies = 3;
      break;
      case states.addArmies:
      this.pendingArmies = Math.round(this.currentPlayer.getCountries().length/2);
      break;
      default:
      this.pendingArmies = 0;
      break;
    }

    this.startTimer();
  }

  removeArmy(country) {
    this.currentPlayer.removeArmy();
    country.removeArmies(1);
  }

  addArmies(country, armies) {
    country.addArmies(armies);
  }

  checkIfWon(defender) {
    var objective = this.currentPlayer.getObjective();
    // Objetivo común
    if (this.currentPlayer.getCountries().length >= 30) {
      this.gameEnded();
    }

    // Objetivo de destrucción
    if (defender && objective.type === OBJECTIVES_TYPES.DESTROY && !defender.getCountries().length) {
      if (objective.value === defender.color) {
        this.gameEnded(); // ganó
      }
      // objetivo de conquista
    } else if (objective.type === OBJECTIVES_TYPES.CONQUER) {
      var obj = angular.copy(objective.value);
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

  isTradedCard(card: Card) {
    return _.contains(this.tradedCards, card);
  }

  trade3Cards(cards: Cards[]) {
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

