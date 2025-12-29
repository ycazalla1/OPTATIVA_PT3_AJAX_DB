// Operacions sencilles de base de dades (No ficar lógica de negoci aquí)
import { pool } from "../db/dbmariadb.js";
import Plat from "../DTO/Plat.js";

export class DAO {
//   static async altaPersona(persona) {
//     try {

//       const consulta = "INSERT INTO persona(NOM, COGNOMS, EMAIL, DNX, TIPUS) VALUES (?, ?, ?, ?, ?)";
//       const valores = [persona.NOM, persona.COGNOMS, persona.EMAIL, persona.DNX, persona.TIPUS];

//       const [resultado] = await pool.query(consulta, valores);
//       const nuevoId = resultado.insertId;

//       const [rows] = await pool.query("SELECT * FROM persona WHERE ID = ?", [nuevoId]);
//       return rows[0];

//     } catch (err) {
//       if (err.code === 'ER_DUP_ENTRY') {
//         throw new Error('El email ja està registrat');
//       } else {
//         throw err;
//       }
//     }
//   }

  static async cercaPlats() {
    const [rowsCombinats] = await db.query("SELECT * FROM plats_combinats");

    // Convertimos cada fila en un DTO
    return rowsCombinats.map(row => new Plat(row));
  }
}