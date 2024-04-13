-- Prompt to delete and recreate the main Club Lit database
\echo 'Delete and recreate the Club Lit database?'
\prompt 'Press Enter to continue or Ctrl+C to cancel > ' confirm

-- Drop and recreate the main database
DROP DATABASE IF EXISTS clublit;
CREATE DATABASE clublit;
\connect clublit

-- Apply schema and seed data
\i clublit_schema.sql
\i clublit_seed.sql

-- Prompt to delete and recreate the Club Lit test database
\echo 'Delete and recreate the Club Lit test database?'
\prompt 'Press Enter to continue or Ctrl+C to cancel > ' confirm_test

-- Drop and recreate the test database
DROP DATABASE IF EXISTS clublit_test;
CREATE DATABASE clublit_test;
\connect clublit_test

\i clublit_schema.sql
