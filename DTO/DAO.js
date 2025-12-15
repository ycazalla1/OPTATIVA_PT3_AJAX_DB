import { pool } from "../db/dbmariadb.js";

export class DAO {
  static async altaPersona(persona) {
    try {

      const consulta = "INSERT INTO persona(NOM, COGNOMS, EMAIL, DNX, TIPUS) VALUES (?, ?, ?, ?, ?)";
      const valores = [persona.NOM, persona.COGNOMS, persona.EMAIL, persona.DNX, persona.TIPUS];

      const [resultado] = await pool.query(consulta, valores);
      const nuevoId = resultado.insertId;

      const [rows] = await pool.query("SELECT * FROM persona WHERE ID = ?", [nuevoId]);
      return rows[0];

    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Error('El email ja està registrat');
      } else {
        throw err;
      }
    }
  }

  static async cercaPersones(param) {
    let consulta = "SELECT * FROM persona WHERE 1=1";
    const valores = [];

    if (param.tipus && param.tipus.trim() !== "") {
      consulta += " AND TIPUS LIKE ?";
      valores.push(`%${param.tipus}%`);
    }

    if (param.cerca && param.cerca.trim() !== "") {
      consulta += " AND CONCAT(NOM, ' ', COGNOMS) LIKE ?";
      valores.push(`%${param.cerca}%`);
    }

    const [rows] = await pool.query(consulta, valores);
    return rows;
  }
}