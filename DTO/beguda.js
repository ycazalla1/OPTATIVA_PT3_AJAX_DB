export default class Beguda {
  constructor({ id, nom, tipus, preu, stock }) {
    this.id = id;                     
    this.nom = nom;                  
    this.tipus = tipus;        
    this.preu = parseFloat(preu);
    this.stock = stock;
  }
}