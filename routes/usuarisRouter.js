import db from "../db/webdb.js";

import express from "express";
import bcrypt from "bcrypt";

import { llistarUsuaris } from "../controllers/usuarisController.js";

const routerUsuari = express.Router();

routerUsuari.get("/", llistarUsuaris);

// --- ENCRIPTACIÓ CONTRASENYA ---

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// GET tots els usuaris
routerUsuari.get("/", async (req, res) => {
  const [rows] = await db.query(`
                                SELECT id, nom, cognoms, email, contrasenya, rol 
                                FROM usuaris
                              `);
  console.log(rows);
  res.json(rows);
});

// GET per ID
routerUsuari.get("/:id", async (req, res) => {
  const [rows] = await db.query(`SELECT id, nom, cognoms, email, contrasenya, rol 
                  FROM usuaris WHERE id = ?`, [req.params.id]);
  console.log(rows[0]);
  res.json(rows[0]);
});

// GET per email
routerUsuari.get("/comprovar/:email", async (req, res) => {
  const [rows] = await db.query(
    `SELECT email FROM usuaris
      WHERE email = ?`, [req.params.email]
  );

  if (rows.length > 0) {
    // El email ja existeix
    return res.json({ existeix: true });
  } else {
    // El email no existeix
    return res.json({ existeix: false });
  }
})

// POST per a inserir els usuaris
routerUsuari.post("/", async (req, res) => {
  console.log(req.body);
  const { nom, cognoms, email, contrasenya, rol } = req.body;
  const hash = await hashPassword(contrasenya);
  await db.query(
    `INSERT INTO usuaris
     (nom, cognoms, email, contrasenya, rol)
     VALUES (?, ?, ?, ?, ?)`,
    [nom, cognoms, email, hash, rol]
  );
  res.json({ ok: true });
});

routerUsuari.patch("/:id", async (req, res) => {
  const { nom, cognoms, email, contrasenya, rol } = req.body;
  const hash = await hashPassword(contrasenya);
  await db.query(
    `UPDATE usuaris
    SET nom = ?, cognoms = ?, email = ?, contrasenya = ?, rol = ?
    WHERE id = ?`,
    [nom, cognoms, email, hash, rol, req.params.id]
  );
  res.json({ ok: true });
});

// DELETE
routerUsuari.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM usuaris WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

export default routerUsuari;