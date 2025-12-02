import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',     // o la IP del contenedor MySQL
  port: 3308,
  user: 'root',          // tu usuario MySQL
  password: '2003',
  database: 'webdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// //EXEMPLE
// const pool = getMySQL();
// const [rows] = await pool.query("SELECT * FROM usuarios WHERE activo = ?", [1]);
