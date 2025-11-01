CREATE DATABASE enerlink;

CREATE TABLE "customer" (
  "id" serial PRIMARY KEY,
  "name" varchar(30),
  "last_name" varchar(50),
  "company" varchar(300),
  "e_mail" varchar(100),
  "phone" varchar(20),
  "pesel" integer,
  "id_document" varchar(20),
  "nip" varchar(20),
  "id_pkwiu" integer,
  "regon" integer,
  "representative" varchar(100),
  "private_or_company" integer,
  "active" bool,
  "created_at" timestamp
);

CREATE TABLE "country" (
  "id" serial PRIMARY KEY,
  "shorcut" varchar(5) NOT NULL,
  "name" varchar(50) NOT NULL
);

CREATE TABLE "city" (
  "id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL
);

CREATE TABLE "district" (
  "id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL
);

CREATE TABLE "address" (
  "id" serial PRIMARY KEY,
  "street" varchar(100),
  "building_nr" varchar(30),
  "local_nr" varchar(20),
  "post_code" varchar(10),
  "id_city" integer,
  "id_district" integer,
  "id_country" integer
);

CREATE TABLE "customer_address" (
  "id" serial PRIMARY KEY,
  "id_address" integer,
  "id_customer" integer UNIQUE
);

CREATE TABLE "supplier_address" (
  "id" serial PRIMARY KEY,
  "id_address" integer,
  "id_supplier" integer UNIQUE
);

CREATE TABLE "ppe" (
  "id" serial PRIMARY KEY,
  "id_customer" integer,
  "id_address" integer,
  "start_date" date NOT NULL,
  "end_date" date,
  "active" bool,
  "created_at" timestamp
);

CREATE TABLE "pkwiu" (
  "id" serial PRIMARY KEY,
  "pkwiu_nr" varchar(10) NOT NULL,
  "pkwiu_name" varchar(500) NOT NULL
);

CREATE TABLE "energy_supplier" (
  "id" serial PRIMARY KEY,
  "name" varchar(300) NOT NULL
);

CREATE TABLE "energy_tariff" (
  "id" serial PRIMARY KEY,
  "name" varchar(30) NOT NULL
);

CREATE TABLE "supplier_offer" (
  "id" serial PRIMARY KEY,
  "id_supplier" integer,
  "id_tariff" integer,
  "id_power_unit" integer,
  "id_currency_unit" integer,
  "price" numeric(10,2),
  "active" bool,
  "start_date" date,
  "end_date" date
);

CREATE TABLE "power_unit" (
  "id" serial PRIMARY KEY,
  "shorcut" varchar(5) NOT NULL,
  "nazwa" varchar(10) NOT NULL
);

CREATE TABLE "currency_unit" (
  "id" serial PRIMARY KEY,
  "shorcut" varchar(5) NOT NULL,
  "nazwa" varchar(10) NOT NULL
);

CREATE TABLE "role" (
  "id" serial PRIMARY KEY,
  "role_name" varchar(30),
  "active" bool
);

CREATE TABLE "password" (
  "id" serial PRIMARY KEY,
  "pass" varchar(20),
  "creation_at" timestamp
);

CREATE TABLE "user" (
  "id" char(12) PRIMARY KEY,
  "first_name" varchar(50),
  "last_name" varchar(50),
  "e_mail" varchar(100),
  "id_role" integer,
  "id_pass" integer UNIQUE,
  "active" bool,
  "created_at" timestamp
);

CREATE TABLE "action" (
  "id" integer PRIMARY KEY,
  "name" varchar(30)
);

CREATE TABLE "user_change_history" (
  "id" integer PRIMARY KEY,
  "id_user_who_changed" char(12),
  "id_user_changed" char(12),
  "id_action" integer,
  "change_time" timestamp
);

CREATE TABLE "user_log_history" (
  "id" integer PRIMARY KEY,
  "id_user" char(12),
  "id_action" integer,
  "log_time" timestamp
);

CREATE TABLE "role_change_history" (
  "id" integer PRIMARY KEY,
  "id_user_who_changed" char(12),
  "id_role" integer,
  "id_action" integer,
  "change_time" timestamp
);

COMMENT ON COLUMN "customer"."id_document" IS 'Passport ID of foreigner';

COMMENT ON COLUMN "customer"."private_or_company" IS 'Sign company or private for example 0 or 1';

ALTER TABLE "customer" ADD FOREIGN KEY ("id_pkwiu") REFERENCES "pkwiu" ("id");

ALTER TABLE "address" ADD FOREIGN KEY ("id_city") REFERENCES "city" ("id");

ALTER TABLE "address" ADD FOREIGN KEY ("id_district") REFERENCES "district" ("id");

ALTER TABLE "address" ADD FOREIGN KEY ("id_country") REFERENCES "country" ("id");

ALTER TABLE "customer_address" ADD FOREIGN KEY ("id_address") REFERENCES "address" ("id");

ALTER TABLE "customer_address" ADD FOREIGN KEY ("id_customer") REFERENCES "customer" ("id");

ALTER TABLE "supplier_address" ADD FOREIGN KEY ("id_address") REFERENCES "address" ("id");

ALTER TABLE "supplier_address" ADD FOREIGN KEY ("id_supplier") REFERENCES "energy_supplier" ("id");

ALTER TABLE "ppe" ADD FOREIGN KEY ("id_customer") REFERENCES "customer" ("id");

ALTER TABLE "ppe" ADD FOREIGN KEY ("id_address") REFERENCES "address" ("id");

ALTER TABLE "supplier_offer" ADD FOREIGN KEY ("id_supplier") REFERENCES "energy_supplier" ("id");

ALTER TABLE "supplier_offer" ADD FOREIGN KEY ("id_tariff") REFERENCES "energy_tariff" ("id");

ALTER TABLE "supplier_offer" ADD FOREIGN KEY ("id_power_unit") REFERENCES "power_unit" ("id");

ALTER TABLE "supplier_offer" ADD FOREIGN KEY ("id_currency_unit") REFERENCES "currency_unit" ("id");

ALTER TABLE "user" ADD FOREIGN KEY ("id_role") REFERENCES "role" ("id");

ALTER TABLE "user" ADD FOREIGN KEY ("id_pass") REFERENCES "password" ("id");

ALTER TABLE "user_change_history" ADD FOREIGN KEY ("id_user_who_changed") REFERENCES "user" ("id");

ALTER TABLE "user_change_history" ADD FOREIGN KEY ("id_user_changed") REFERENCES "user" ("id");

ALTER TABLE "user_change_history" ADD FOREIGN KEY ("id_action") REFERENCES "action" ("id");

ALTER TABLE "user_log_history" ADD FOREIGN KEY ("id_user") REFERENCES "user" ("id");

ALTER TABLE "user_log_history" ADD FOREIGN KEY ("id_action") REFERENCES "action" ("id");

ALTER TABLE "role_change_history" ADD FOREIGN KEY ("id_user_who_changed") REFERENCES "user" ("id");

ALTER TABLE "role_change_history" ADD FOREIGN KEY ("id_role") REFERENCES "role" ("id");

ALTER TABLE "role_change_history" ADD FOREIGN KEY ("id_action") REFERENCES "action" ("id");
