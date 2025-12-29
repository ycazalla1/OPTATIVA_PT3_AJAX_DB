import { getAllUsuaris } from "../DAO/UsuarisDAO.js";

export async function llistarUsuaris(req, res) {
  try {
    const usuaris = await getAllUsuaris();
    res.json(usuaris); // Envia els DTOs com JSON al frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obtenint usuaris." });
  }
}