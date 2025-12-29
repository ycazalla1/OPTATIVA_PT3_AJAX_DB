import { getAllPlats } from "../DAO/ComandesDAO.js";

export async function listarPlats(req, res) {
  try {
    const plats = await getAllPlats();
    res.json(plats); // Envía los DTOs como JSON al frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo platos" });
  }
}