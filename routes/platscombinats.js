// import express from "express"
// import personesController from "../controllers/personasController.js";

// const misrutas = express.Router();
 
// // GET todos las personas
// misrutas.get("/", personesController.getPersones);
// misrutas.post("/", personesController.altaPersona);
// misrutas.post("/cerca", personesController.cercaPersones);


// //module.exports = router;
// export default misrutas;

import express from "express";
// ✅ BIEN
import { listarPlats } from "../controllers/combinatsController.js";
import { agregarPlat } from "../controllers/combinatsController.js";
import { deletePlat } from "../controllers/combinatsController.js";

const router = express.Router();

// Rutas per els plats combinats
// GET
// router.get("/", listarPlats);

// // POST
// router.post("/", agregarPlat);

// // DELETE
// router.delete("/:id", deletePlat);

// GET
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM plats_combinats");
  res.json(rows);
});

// POST
router.post("/", async (req, res) => {
  const { nom, acompanamient1, acompanamient2, alergies, preu } = req.body;
  const [result] = await db.query(
    `INSERT INTO plats_combinats (nom, acompanamient1, acompanamient2, alergies, preu)
     VALUES (?, ?, ?, ?, ?)`,
    [nom, acompanamient1, acompanamient2, alergies, preu]
  );
  res.json({ ok: true, id: result.insertId });
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const [result] = await db.query(
    "DELETE FROM plats_combinats WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) return res.status(404).json({ ok: false, msg: "Plat no trobat" });

  res.json({ ok: true });
});


export default router;
