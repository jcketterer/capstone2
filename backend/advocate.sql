\echo 'Delete and recreate advocate DB?'
\prompt 'Return for yes or control-c to cancel > ' foo

DROP DATABASE advocate;
CREATE DATABASE advocate;
\connect advocate

\i advocate_schema.sql
\i seed.sql

\echo 'Delete and recreate advocate_test db?'
\prompt 'Return yes of control-c to cancel > ' foo

DROP DATABASE advocate_test;
CREATE DATABASE advocate_test;
\connect advocate_test;

\i advocate_test.sql