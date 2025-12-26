-- create user
CREATE USER ener WITH PASSWORD 'link';

-- create database
CREATE DATABASE enerlink_db OWNER ener;

-- basic privileges
GRANT ALL PRIVILEGES ON DATABASE enerlink_db TO ener;

-- optional: encoding and locale
ALTER DATABASE enerlink_db SET client_encoding TO 'UTF8';
ALTER DATABASE enerlink_db SET timezone TO 'UTC';
