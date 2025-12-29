export default class Menu {
  constructor({ id, menu, beguda, alergens, quantitat, preu }) {
    this.id = id;
    this.menu = menu;
    this.beguda = beguda;
    this.alergens = alergens;
    this.quantitat = quantitat;
    this.preu = parseFloat(preu);
  }
}