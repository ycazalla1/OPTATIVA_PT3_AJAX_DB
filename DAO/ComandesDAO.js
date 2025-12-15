import db from "../db/webdb.js";
import Plat from "../DTO/Plat.js";

export async function getAllPlats() {
  const [rowsCombinats] = await db.query("SELECT * FROM plats_combinats");


  // Convertimos cada fila en un DTO
  return rowsCombinats.map(row => new Plat(row));

}

