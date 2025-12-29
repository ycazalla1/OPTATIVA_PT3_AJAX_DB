import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',     // o la IP del contenedor MySQL
  port: 3308,
  user: 'root',          // tu usuario MySQL
  password: '1234',
  database: 'webdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;


// //EXEMPLE
// const pool = getMySQL();
// const [rows] = await pool.query("SELECT * FROM usuarios WHERE activo = ?", [1]);
