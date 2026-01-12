import { getAllItems } from "../DAO/MagatzemDAO.js";

export async function llistarItems(req, res) {
  try {
    const items = await getAllItems();
    res.json(items); // Envia els DTOs com JSON al frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obtenint items." });
  }
}