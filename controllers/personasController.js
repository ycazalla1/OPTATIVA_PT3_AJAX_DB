import { pool } from "../db/dbmariadb.js";
import { Persona } from "../DTO/Persona.js";
import { DAO } from "../DTO/DAO.js";

export default class personasController {
  static async altaPersona(req,res){
    try {
      const novaPersona = req.body;

      const { NOM, COGNOMS, EMAIL, DNX, TIPUS } = novaPersona;
      if (!NOM || !COGNOMS || !EMAIL || !DNX || !TIPUS) {
        return res.status(400).json({ success: false, mensaje: 'Tots els camps són obligatoris.' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(EMAIL)) {
        return res.status(400).json({ success: false, mensaje: 'Email invàlid.' });
      }
      
      const persona = new Persona(
        novaPersona.NOM,
        novaPersona.COGNOMS,
        novaPersona.EMAIL,
        novaPersona.DNX,
        novaPersona.TIPUS);
        
      const personaCreada = await DAO.altaPersona(persona);
      res.status(201).json({ success: true, persona: personaCreada });

    } catch (error) {
      console.error("Error consultant persona:", error);
      if (error.message.includes('Duplicate entry')) {
        res.status(400).json({ success: false, mensaje: 'El email ja està registrat' });
      } else {
        res.status(500).json({ success: false, mensaje: 'Error consultant persona' });
      }
    }
  }

  static async getPersones(req, res) {
    try {
      //let consulta = 'SELECT * FROM persona WHERE NOM LIKE "%PAU%"'
      let consulta = "SELECT * FROM persona";
      const [rows] = await pool.query(consulta);
      res.json(rows);
    } catch (error) {
      console.error("Error consultando productos:", error);
      res.status(500).json({ error: "Error consultando persona" });
    }
  }

  static async cercaPersones(req, res) {
    try {
      const params = req.body;
      //let consulta = 'SELECT * FROM persona WHERE NOM LIKE "%PAU%"'
      let consulta = "SELECT * FROM persona WHERE 1=1";
      const valores = [];

      if (params.tipus && params.tipus.trim() !== "") {
        consulta += " AND TIPUS LIKE ?";
        valores.push(`%${params.tipus}%`);
      }

      if (params.cerca && params.cerca.trim() !== "") {
        consulta += " AND CONCAT(NOM, ' ', COGNOMS) LIKE ?";
        valores.push(`%${params.cerca}%`);
      }

      const [rows] = await pool.query(consulta, valores);
      res.json(rows);
    } catch (error) {
      console.error("Error consultando productos:", error);
      res.status(500).json({ error: "Error consultando persona" });
    }
  }
}
