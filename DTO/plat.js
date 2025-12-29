export default class Plat {
  constructor({ id, nom, acompanamient1, acompanamient2, alergies, preu }) {
    this.id = id;                     
    this.nom = nom;                  
    this.acompanamient1 = acompanamient1; 
    this.acompanamient2 = acompanamient2; 
    this.alergies = alergies;         
    this.preu = parseFloat(preu);     
  }
}