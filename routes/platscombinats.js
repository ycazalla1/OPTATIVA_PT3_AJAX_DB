import express from "express";
import db from "../db/webdb.js";

const router = express.Router();


// GET tots els plats
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM plats_combinats");
  res.json(rows);
});

// GET plat per id
router.get("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM plats_combinats WHERE id = ?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: "Plat no trobat" });
  res.json(rows[0]);
});

// POST nou plat
router.post("/", async (req, res) => {
  const { nom, acompanyament1, acompanyament2, alergies, preu } = req.body;
  const [result] = await db.query(
    `INSERT INTO plats_combinats (nom, acompanyament1, acompanyament2, alergies, preu)
     VALUES (?, ?, ?, ?, ?)`,
    [nom, acompanyament1, acompanyament2, alergies, preu]
  );
  res.json({ ok: true, id: result.insertId });
});

// PUT actualitza plat
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nom, acompanyament1, acompanyament2, alergies, preu } = req.body;

  // Verificar que el plato exista
  const [rows] = await db.query("SELECT * FROM plats_combinats WHERE id = ?", [id]);
  if (rows.length === 0) return res.status(404).json({ error: "Plat no trobat" });

  // Actualizar el plato
  await db.query(
    `UPDATE plats_combinats
     SET nom = ?, acompanyament1 = ?, acompanyament2 = ?, alergies = ?, preu = ?
     WHERE id = ?`,
    [nom, acompanyament1, acompanyament2, alergies, preu, id]
  );

  res.json({ ok: true, id });
});



// DELETE
router.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM plats_combinats WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

export default router;
