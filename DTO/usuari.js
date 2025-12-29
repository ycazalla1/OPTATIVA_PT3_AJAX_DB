export default class Usuari {
  constructor({ id, nom, cognoms, email, contrasenya, rol }) {
    this.id = id;
    this.nom = nom;
    this.cognoms = cognoms;
    this.email = email;
    this.contrasenya = contrasenya;
    this.rol = rol;
  }
}