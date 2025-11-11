const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'postgres',
  host: 'mi_postgres_persistente', 
  database: 'miweb',
  password: '1234',
  port: 5432,
});




async function init() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS usersdb (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      )
    `);

    const hashedPwd = bcrypt.hashSync('1234', 10);
    const hashedPwd2 = bcrypt.hashSync('1111', 10);

    await client.query(
      'INSERT INTO usersdb (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
      ['adri', hashedPwd, 'user']
    );
    await client.query(
      'INSERT INTO usersdb (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
      ['admin', hashedPwd2, 'admin']
    );

    console.log('Base de datos inicializada correctamente');
  } finally {
    client.release();
    pool.end();
  }
}

init().catch(err => {
  console.error('Error init-db:', err);
});
