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

const router = express.Router();

router.get("/", listarPlats);

// GET todos los platos
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM plats_combinats");
  res.json(rows);
});

// POST para insertar
router.post("/", async (req, res) => {
  const { nom, acompanamient1, acompanamient2, alergies, preu } = req.body;
  await db.query(
    `INSERT INTO plats_combinats
     (nom, acompanamient1, acompanamient2, alergies, preu)
     VALUES (?, ?, ?, ?, ?)`,
    [nom, acompanamient1, acompanamient2, alergies, preu]
  );
  res.json({ ok: true });
});

// DELETE
router.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM plats_combinats WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

// 🔥 ESTO ES OBLIGATORIO
export default router;
