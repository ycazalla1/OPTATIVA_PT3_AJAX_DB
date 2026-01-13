export default class Menu {
  constructor({ id, nom, menu, beguda, alergens, quantitat, preu }) {
    this.id = id;
    this.nom = nom;
    this.menu = menu;
    this.beguda = beguda;
    this.alergens = alergens;
    this.quantitat = quantitat;
    this.preu = parseFloat(preu);
  }
}