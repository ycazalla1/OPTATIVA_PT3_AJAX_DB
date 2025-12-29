import db from "../db/webdb.js";

import express from "express";
import { llistarMenus } from "../controllers/menuCantinaController.js";

const routerMenuCantina = express.Router();

routerMenuCantina.get("/", llistarMenus);

// GET tots els plats
routerMenuCantina.get("/", async (req, res) => {
  const [rows] = await db.query(`
                                SELECT id, menu, beguda, alergens, quantitat, preu 
                                FROM menu_cantina
                              `);
  console.log(rows);
  res.json(rows);
});

// PATCH: Incrementar Menú en 1
routerMenuCantina.patch("/:id/quantitat", async (req, res) => {
  const { id } = req.params;

  await db.query(
    `UPDATE menu_cantina
     SET quantitat = quantitat + 1
     WHERE id = ?`,
    [id]
  );

  res.json({ ok: true });
});

// POST per a inserir
routerMenuCantina.post("/", async (req, res) => {
  console.log(req.body);
  const { menu, beguda, alergens, quantitat, preu } = req.body;
  await db.query(
    `INSERT INTO menu_cantina
     (menu, beguda, alergens, quantitat, preu)
     VALUES (?, ?, ?, ?, ?)`,
    [menu, beguda, alergens, quantitat, preu]
  );
  res.json({ ok: true });
});

// DELETE
routerMenuCantina.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM menu_cantina WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

export default routerMenuCantina;