import db from "../db/webdb.js";
import Magatzem from "../DTO/Magatzem.js";

export async function getAllItems() {
  const [rowsItems] = await db.query("SELECT * FROM magatzem");


  // Convertimos cada fila en un DTO
  return rowsItems.map(row => new Magatzem(row));

}