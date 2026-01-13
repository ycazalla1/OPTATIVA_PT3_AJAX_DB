import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',     // o la IP del contenidor MySQL
  port: 3308,
  user: 'root',          // usuari MySQL
  password: '1234',
  database: 'webdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
