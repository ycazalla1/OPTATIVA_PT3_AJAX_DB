import db from "../db/webdb.js";
import Menu from "../DTO/Menu.js";

export async function getAllMenus() {
  const [rowsMenus] = await db.query("SELECT * FROM menu_cantina");


  // Convertims cada fila en un DTO
  return rowsMenus.map(row => new Menu(row));

}