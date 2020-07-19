import { Component, Input } from "@angular/core";
import { Player } from 'src/type/player';

@Component({
  templateUrl: "./playerName.component.html",
  selector: "player-name",
})
export class PlayerNameComponent {
  @Input() player: Player;
  @Input() currentPlayer: Player = null;

  isCurrentPlayer () {
    return this.player.name === this.currentPlayer?.name;
  }

  constructor() {}
}
