import db from "../db/webdb.js";

import express from "express";
import { llistarBegudes } from "../controllers/begudesController.js";

const routerBeguda = express.Router();

routerBeguda.get("/", llistarBegudes);

// GET totes les begudes
routerBeguda.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM begudes");
  res.json(rows);
});

// GET per ID
routerBeguda.get("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM begudes WHERE id = ?",
                                [req.params.id])
  res.json(rows[0]);
});

// POST per inserir begudes
routerBeguda.post("/", async (req, res) => {
  const { nom, tipus, preu, stock } = req.body;
  await db.query(
    `INSERT INTO begudes
     (nom, tipus, preu, stock)
     VALUES (?, ?, ?, ?)`,
    [nom, tipus, preu, stock]
  );
  res.json({ ok: true });
});

// POST per actualitzar begudes per id
routerBeguda.post("/:id", async (req, res) => {
  const { nom, tipus, preu, stock } = req.body;
  await db.query(
    `UPDATE begudes
     SET nom = ?,
         tipus = ?,
         preu = ?,
         stock = ?
     WHERE id = ?`,
    [nom, tipus, preu, stock, req.params.id]
  );
  res.json({ ok: true });
});

// DELETE per eliminar begudes per ID
routerBeguda.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM begudes WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

export default routerBeguda;