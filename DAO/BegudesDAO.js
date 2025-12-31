import db from "../db/webdb.js";
import Beguda from "../DTO/Beguda.js";

export async function getAllBegudes() {
  const [rowsBegudes] = await db.query("SELECT * FROM begudes");


  // Convertimos cada fila en un DTO
  return rowsBegudes.map(row => new Beguda(row));

}