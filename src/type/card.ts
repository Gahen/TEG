import {CountryId} from 'src/type/country';

export enum CardTypes {
  barco,
  globo,
  cañon,
}

export const allCardTypes = [
  CardTypes.barco,
  CardTypes.globo,
  CardTypes.cañon,
];

export interface ICard {
  id: CountryId;
  type: CardTypes;
  active?: boolean; // represents the user selecting card for a trade
}

export const Cards: ICard[] = [
  {'id': CountryId.gran_bretana,'type': CardTypes.globo},
  {'id': CountryId.argentina,'type': CardTypes.globo},
  {'id': CountryId.chile,'type': CardTypes.barco},
  {'id': CountryId.uruguay,'type': CardTypes.barco},
  {'id': CountryId.brasil,'type': CardTypes.barco},
  {'id': CountryId.sahara,'type': CardTypes.globo},
  {'id': CountryId.espana,'type': CardTypes.barco},
  {'id': CountryId.francia,'type': CardTypes.barco},
  {'id': CountryId.italia,'type': CardTypes.cañon},
  {'id': CountryId.alemania,'type': CardTypes.globo},
  {'id': CountryId.egipto,'type': CardTypes.barco},
  {'id': CountryId.madagascar,'type': CardTypes.barco},
  {'id': CountryId.oregon,'type': CardTypes.cañon},
  {'id': CountryId.alaska,'type': CardTypes.barco},
  {'id': CountryId.groenlandia,'type': CardTypes.globo},
  {'id': CountryId.etiopia,'type': CardTypes.barco},
  {'id': CountryId.rusia,'type': CardTypes.barco},
  {'id': CountryId.nueva_york,'type': CardTypes.globo},
  {'id': CountryId.terranova,'type': CardTypes.cañon},
  {'id': CountryId.canada,'type': CardTypes.cañon},
  {'id': CountryId.polonia,'type': CardTypes.globo},
  {'id': CountryId.california,'type': CardTypes.barco},
  {'id': CountryId.mexico,'type': CardTypes.barco},
  {'id': CountryId.labrador,'type': CardTypes.cañon},
  {'id': CountryId.yukon,'type': CardTypes.globo},
  {'id': CountryId.peru,'type': CardTypes.barco},
  {'id': CountryId.colombia,'type': CardTypes.barco},
  {'id': CountryId.islandia,'type': CardTypes.barco},
  {'id': CountryId.suecia,'type': CardTypes.barco},
  {'id': CountryId.turquia,'type': CardTypes.barco},
  {'id': CountryId.israel,'type': CardTypes.cañon},
  {'id': CountryId.arabia,'type': CardTypes.cañon},
  {'id': CountryId.zaire,'type': CardTypes.globo},
  {'id': CountryId.sudafrica,'type': CardTypes.barco},
  {'id': CountryId.australia,'type': CardTypes.barco},
  {'id': CountryId.sumatra,'type': CardTypes.barco},
  {'id': CountryId.borneo,'type': CardTypes.cañon},
  {'id': CountryId.java,'type': CardTypes.globo},
  {'id': CountryId.india,'type': CardTypes.globo},
  {'id': CountryId.malasia,'type': CardTypes.cañon},
  {'id': CountryId.iran,'type': CardTypes.cañon},
  {'id': CountryId.china,'type': CardTypes.globo},
  {'id': CountryId.gobi,'type': CardTypes.globo},
  {'id': CountryId.mongolia,'type': CardTypes.barco},
  {'id': CountryId.siberia,'type': CardTypes.globo},
  {'id': CountryId.aral,'type': CardTypes.globo},
  {'id': CountryId.tartaria,'type': CardTypes.barco},
  {'id': CountryId.tamir,'type': CardTypes.globo},
  {'id': CountryId.kamchatka,'type': CardTypes.cañon},
  {'id': CountryId.japon,'type': CardTypes.globo},
];

export const isCard = (card: any) : card is ICard => Cards.includes(card);

