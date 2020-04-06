import {Player} from 'src/type/player';

export enum CountryId {
  'gran_bretana',
  'alaska',
  'argentina',
  'chile',
  'uruguay',
  'brasil',
  'sahara',
  'espana',
  'francia',
  'italia',
  'alemania',
  'egipto',
  'madagascar',
  'oregon',
  'groenlandia',
  'etiopia',
  'rusia',
  'nueva_york',
  'terranova',
  'canada',
  'polonia',
  'california',
  'mexico',
  'labrador',
  'yukon',
  'peru',
  'colombia',
  'islandia',
  'suecia',
  'turquia',
  'israel',
  'arabia',
  'zaire',
  'sudafrica',
  'australia',
  'sumatra',
  'borneo',
  'java',
  'india',
  'malasia',
  'iran',
  'china',
  'gobi',
  'mongolia',
  'siberia',
  'aral',
  'tartaria',
  'tamir',
  'kamchatka',
  'japon',
}

const CountryData: ICountry[] = [
  {
    id: CountryId.gran_bretana,
    name: 'Gran Bretaña',
    continent: 'europa',
    limits: [CountryId.alemania, CountryId.espana, CountryId.islandia]
  },
  {
    id: CountryId.alaska,
    name: "Alaska",
    'continent':'america del norte','limits':[CountryId.yukon,CountryId.kamchatka,CountryId.oregon]},
  {
    id: CountryId.argentina,
    name: 'Argentina', 'continent':'america del sur','limits':[CountryId.chile,CountryId.peru,CountryId.brasil,CountryId.uruguay]},
  {
    id: CountryId.chile,
    name: 'Chile', 'continent':'america del sur','limits':[CountryId.argentina,CountryId.peru,CountryId.australia]} ,
  {
    id: CountryId.uruguay,
    name: 'Uruguay', 'continent':'america del sur','limits':[CountryId.brasil,CountryId.argentina]},
  {
    id: CountryId.brasil,
    name: 'Brasil', 'continent':'america del sur','limits':[CountryId.uruguay,CountryId.argentina,CountryId.peru,CountryId.colombia,CountryId.sahara]},
  {
    id: CountryId.sahara,
    name: 'Sahara', 'continent':'africa','limits':[CountryId.zaire,CountryId.etiopia,CountryId.egipto,CountryId.espana,CountryId.brasil]},
  {
    id: CountryId.espana,
    name: 'Espana', 'continent':'europa','limits':[CountryId.francia,CountryId.sahara,CountryId.gran_bretana]},
  {
    id: CountryId.francia,
    name: 'Francia', 'continent':'europa','limits':[CountryId.italia,CountryId.alemania,CountryId.espana]},
  {
    id: CountryId.italia,
    name: 'Italia', 'continent':'europa','limits':[CountryId.francia,CountryId.alemania]},
  {
    id: CountryId.alemania,
    name: 'Alemania', 'continent':'europa','limits':[CountryId.polonia,CountryId.gran_bretana,CountryId.francia,CountryId.italia]},
  {
    id: CountryId.egipto,
    name: 'Egipto', 'continent':'africa','limits':[CountryId.etiopia,CountryId.madagascar,CountryId.sahara,CountryId.israel,CountryId.turquia,CountryId.polonia]},
  {
    id: CountryId.madagascar,
    name: 'Madagascar', 'continent':'africa','limits':[CountryId.egipto,CountryId.zaire]},
  {
    id: CountryId.oregon,
    name: 'Oregon', 'continent':'america del norte','limits':[CountryId.alaska,CountryId.yukon,CountryId.canada,CountryId.nueva_york,CountryId.california]},
  {
    id: CountryId.groenlandia,
    name: 'Groenlandia', 'continent':'america del norte','limits':[CountryId.labrador,CountryId.nueva_york,CountryId.islandia]},
  {
    id: CountryId.etiopia,
    name: 'Etiopia', 'continent':'africa','limits':[CountryId.sudafrica,CountryId.zaire,CountryId.sahara,CountryId.egipto]},
  {
    id: CountryId.rusia,
    name: 'Rusia', 'continent':'europa','limits':[CountryId.polonia,CountryId.turquia,CountryId.iran,CountryId.aral,CountryId.suecia]},
  {
    id: CountryId.nueva_york,
    name: 'Nueva York', 'continent':'america del norte','limits':[CountryId.california,CountryId.oregon,CountryId.canada,CountryId.terranova,CountryId.groenlandia]},
  {
    id: CountryId.terranova,
    name: 'Terranova', 'continent':'america del norte','limits':[CountryId.nueva_york,CountryId.labrador,CountryId.canada]},
  {
    id: CountryId.canada,
    name: 'Canada', 'continent':'america del norte','limits':[CountryId.yukon,CountryId.oregon,CountryId.nueva_york,CountryId.terranova]},
  {
    id: CountryId.polonia,
    name: 'Polonia', 'continent':'europa','limits':[CountryId.alemania,CountryId.rusia,CountryId.turquia,CountryId.egipto]},
  {
    id: CountryId.california,
    name: 'California', 'continent':'america del norte','limits':[CountryId.mexico,CountryId.nueva_york,CountryId.oregon]},
  {
    id: CountryId.mexico,
    name: 'Mexico', 'continent':'america del norte','limits':[CountryId.colombia,CountryId.california]},
  {
    id: CountryId.labrador,
    name: 'Labrador', 'continent':'america del norte','limits':[CountryId.groenlandia,CountryId.terranova]},
  {
    id: CountryId.yukon,
    name: 'Yukon', 'continent':'america del norte','limits':[CountryId.alaska,CountryId.oregon,CountryId.canada]},
  {
    id: CountryId.peru,
    name: 'Peru', 'continent':'america del sur','limits':[CountryId.colombia,CountryId.brasil,CountryId.argentina,CountryId.chile]},
  {
    id: CountryId.colombia,
    name: 'Colombia', 'continent':'america del sur','limits':[CountryId.peru,CountryId.brasil,CountryId.mexico]},
  {
    id: CountryId.islandia,
    name: 'Islandia', 'continent':'europa','limits':[CountryId.gran_bretana,CountryId.suecia,CountryId.groenlandia]},
  {
    id: CountryId.suecia,
    name: 'Suecia', 'continent':'europa','limits':[CountryId.rusia,CountryId.islandia]},
  {
    id: CountryId.turquia,
    name: 'Turquia', 'continent':'asia','limits':[CountryId.israel,CountryId.arabia,CountryId.iran,CountryId.rusia,CountryId.polonia,CountryId.egipto]},
  {
    id: CountryId.israel,
    name: 'Israel', 'continent':'asia','limits':[CountryId.turquia,CountryId.arabia,CountryId.egipto]},
  {
    id: CountryId.arabia,
    name: 'Arabia', 'continent':'asia','limits':[CountryId.israel,CountryId.turquia]},
  {
    id: CountryId.zaire,
    name: 'Zaire', 'continent':'africa','limits':[CountryId.sahara,CountryId.etiopia,CountryId.sudafrica,CountryId.madagascar]},
  {
    id: CountryId.sudafrica,
    name: 'Sudafrica', 'continent':'africa','limits':[CountryId.zaire,CountryId.etiopia]},
  {
    id: CountryId.australia,
    name: 'Australia', 'continent':'oceania','limits':[CountryId.java,CountryId.borneo,CountryId.sumatra,CountryId.chile]},
  {
    id: CountryId.sumatra,
    name: 'Sumatra', 'continent':'oceania','limits':[CountryId.india,CountryId.australia]},
  {
    id: CountryId.borneo,
    name: 'Borneo', 'continent':'oceania','limits':[CountryId.australia,CountryId.malasia]},
  {
    id: CountryId.java,
    name: 'Java', 'continent':'oceania','limits':[CountryId.australia]},
  {
    id: CountryId.india,
    name: 'India', 'continent':'asia','limits':[CountryId.sumatra,CountryId.china,CountryId.malasia,CountryId.iran]},
  {
    id: CountryId.malasia,
    name: 'Malasia', 'continent':'asia','limits':[CountryId.china,CountryId.india]},
  {
    id: CountryId.iran,
    name: 'Iran', 'continent':'asia','limits':[CountryId.rusia,CountryId.aral,CountryId.mongolia,CountryId.gobi,CountryId.china,CountryId.india,CountryId.turquia]},
  {
    id: CountryId.china,
    name: 'China', 'continent':'asia','limits':[CountryId.japon,CountryId.kamchatka,CountryId.siberia,CountryId.mongolia,CountryId.gobi,CountryId.iran,CountryId.india,CountryId.malasia]},
  {
    id: CountryId.gobi,
    name: 'Gobi', 'continent':'asia','limits':[CountryId.china,CountryId.mongolia,CountryId.iran]},
  {
    id: CountryId.mongolia,
    name: 'Mongolia', 'continent':'asia','limits':[CountryId.china,CountryId.siberia,CountryId.aral,CountryId.iran,CountryId.gobi]},
  {
    id: CountryId.siberia,
    name: 'Siberia', 'continent':'asia','limits':[CountryId.kamchatka,CountryId.china,CountryId.mongolia,CountryId.aral,CountryId.tartaria,CountryId.tamir]},
  {
    id: CountryId.aral,
    name: 'Aral', 'continent':'asia','limits':[CountryId.tartaria,CountryId.siberia,CountryId.mongolia,CountryId.iran,CountryId.rusia]},
  {
    id: CountryId.tartaria,
    name: 'Tartaria', 'continent':'asia','limits':[CountryId.tamir,CountryId.siberia,CountryId.aral]},
  {
    id: CountryId.tamir,
    name: 'Tamir', 'continent':'asia','limits':[CountryId.tartaria,CountryId.siberia]},
  {
    id: CountryId.kamchatka,
    name: 'Kamchatka', 'continent':'asia','limits':[CountryId.japon,CountryId.china,CountryId.siberia]},
  {
    id: CountryId.japon,
    name: 'Japon', 'continent':'asia','limits':[CountryId.kamchatka,CountryId.china]}
];

type Continent = string;

interface ICountry {
  id: CountryId;
  name: string;
  limits: CountryId[];
  continent: Continent;
  armies?: number;
  owner?: Player;
}

export class Country implements ICountry {
  armies: number = 0;
  owner: Player;

  constructor(public id: CountryId, public name: string, public limits: CountryId[], public continent: Continent) {}
 
  addArmies(armies: number) {
    this.armies += armies;
  }

  removeArmies(armies: number) {
    this.armies -= armies;
  }

  setArmies(armies: number) {
    this.armies = armies;
  }

  limitsWith(c: Country): boolean {
    return this.limits.includes(c.id);
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  static find(countryId: CountryId) {
    return Countries.find(c => c.id === countryId);
  }
}

export const isCountry = (country: any): country is Country => {
  return !!CountryId[country.id];
}

export const Countries: Country[] = CountryData.map(d => new Country(d.id, d.name, d.limits, d.continent));

