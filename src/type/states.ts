export enum gameState {
  // Base states
  attack = 'Ataque',
  addArmies = 'Agregar Ejércitos',
  // Starting states
  firstArmies = 'Sumar tropas iniciales',
  secondArmies = 'Sumar tropas secundarias',
  // attacking sub states
  regroup = 'Reagrupar',
  afterCard = 'Tomar tarjeta'
}
