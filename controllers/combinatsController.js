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

export async function agregarPlat(req, res) {
  const { nom, acompanamient1, acompanamient2, alergies, preu } = req.body; 
  try {

    const newPlatId = await insertPlat({ nom, acompanamient1, acompanamient2, alergies, preu });
    res.json({ ok: true, id: newPlatId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error agregando plato" });
  }
}

export async function deletePlat(req, res) {
  const { id } = req.params;  

  try {
    await deletePlatById(id);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando plato" });
  }
}

// router.post("/", async (req, res) => {
//   const { nom, acompanamient1, acompanamient2, alergies, preu } = req.body;
//   const [result] = await db.query(
//     `INSERT INTO plats_combinats
//       (nom, acompanamient1, acompanamient2, alergies, preu)
//      VALUES (?, ?, ?, ?, ?)`,
//     [nom, acompanamient1, acompanamient2, alergies, preu]
//   );
//   res.json({ ok: true, id: result.insertId });
// });


// // GET
// router.get("/", async (req, res) => {
//   const [rows] = await db.query("SELECT * FROM plats_combinats");
//   res.json(rows);
// });



// // POST
// router.post("/", async (req, res) => {
//   const { nom, acompanamient1, acompanamient2, alergies, preu } = req.body;
//   const [result] = await db.query(
//     `INSERT INTO plats_combinats
//       (nom, acompanamient1, acompanamient2, alergies, preu)
//      VALUES (?, ?, ?, ?, ?)`,
//     [nom, acompanamient1, acompanamient2, alergies, preu]
//   );
//   res.json({ ok: true, id: result.insertId });
// });

// // DELETE
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   const [result] = await db.query(
//     "DELETE FROM plats_combinats WHERE id = ?",
//     [id]
//   );

//   if (result.affectedRows === 0) return res.status(404).json({ ok: false, msg: "Plat no trobat" });

//   res.json({ ok: true });
// });

// export default router;