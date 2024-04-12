const { Pool } = require('pg');

/**
 * Database configuration file.
 * This file configures the PostgreSQL connection pool using environment variables.
 * The pool handles connections to the PostgreSQL database, optimizing connection re-use,
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
