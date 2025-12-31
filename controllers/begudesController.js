import { getAllBegudes } from "../DAO/BegudesDAO.js";

export async function llistarBegudes(req, res) {
  try {
    const begudes = await getAllBegudes();
    res.json(begudes); // Envia els DTOs com JSON al frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obtenint begudes." });
  }
}