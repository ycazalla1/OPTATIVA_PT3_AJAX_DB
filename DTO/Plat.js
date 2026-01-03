export default class Plat {
  constructor({ id, nom, acompanyament1, acompanyament2, alergies, preu }) {
    this.id = id;                     
    this.nom = nom;                  
    this.acompanyament1 = acompanyament1; 
    this.acompanyament2 = acompanyament2; 
    this.alergies = alergies;         
    this.preu = parseFloat(preu);     
  }
}

