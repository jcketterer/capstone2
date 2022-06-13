\echo 'Delete and recreate advocate DB?'
\prompt 'Return for yes or control-c to cancel > ' foo

DROP DATABASE advocate;
CREATE DATABASE advocate;
\connect advocate

\i advocate_schema.sql
\i seed.sql

