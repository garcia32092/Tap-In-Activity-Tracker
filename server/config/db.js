require('dotenv').config();
const { Pool } = require('pg');

const DB_USER = process.env.DATABASE_USER;
const DB_HOST = process.env.DATABASE_HOST;
const DB_NAME = process.env.DATABASE_NAME;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;
const DB_PORT = process.env.DATABASE_PORT;

// Set up PostgreSQL connection pool
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT || 5432,
});

module.exports = pool;
