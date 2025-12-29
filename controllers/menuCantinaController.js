import { getAllMenus } from "../DAO/MenusDAO.js";

export async function llistarMenus(req, res) {
  try {
    const menus = await getAllMenus();
    res.json(menus); // Envia els DTOs com JSON al frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obtenint menus." });
  }
}