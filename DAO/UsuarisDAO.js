import db from "../db/webdb.js";
import Usuari from "../DTO/Usuari.js";

export async function getAllUsuaris() {
  const [rowsUsuaris] = await db.query("SELECT * FROM usuaris");


  // Convertims cada fila en un DTO
  return rowsUsuaris.map(row => new Usuari(row));

}