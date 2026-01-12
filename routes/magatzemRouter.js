import db from "../db/webdb.js";

import express from "express";
import { llistarItems } from "../controllers/magatzemController.js";

const routerMagatzem = express.Router();

routerMagatzem.get("/", llistarItems);

// GET totes els items
routerMagatzem.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM magatzem");
  res.json(rows);
});

// GET per ID
routerMagatzem.get("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM magatzem WHERE id = ?",
                                [req.params.id])
  res.json(rows[0]);
});

// POST per inserir items
routerMagatzem.post("/", async (req, res) => {
  const { data, producte, stock, comentari } = req.body;
  await db.query(
    `INSERT INTO magatzem
     (data, producte, stock, comentari)
     VALUES (?, ?, ?, ?)`,
    [data, producte, stock, comentari]
  );
  res.json({ ok: true });
});

// POST per actualitzar items per id
routerMagatzem.post("/:id", async (req, res) => {
  const { data, producte, stock, comentari } = req.body;
  await db.query(
    `UPDATE magatzem
     SET data = ?,
         producte = ?,
         stock = ?,
         comentari = ?
     WHERE id = ?`,
    [data, producte, stock, comentari, req.params.id]
  );
  res.json({ ok: true });
});

// DELETE per eliminar items per ID
routerMagatzem.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM magatzem WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

export default routerMagatzem;