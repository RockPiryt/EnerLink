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

COMMENT ON COLUMN "customer"."id_document" IS 'Passport ID of foreigner';

COMMENT ON COLUMN "customer"."private_or_company" IS 'Sign company or private for example 0 or 1';

ALTER TABLE "customer" ADD CONSTRAINT "customer_pkwiu" FOREIGN KEY ("id_pkwiu") REFERENCES "pkwiu" ("id");

ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_to_address" FOREIGN KEY ("id_address") REFERENCES "address" ("id");

ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_to_customer" FOREIGN KEY ("id_customer") REFERENCES "customer" ("id");

ALTER TABLE "supplier_address" ADD CONSTRAINT "supplier_address_to_address" FOREIGN KEY ("id_address") REFERENCES "address" ("id");

ALTER TABLE "supplier_address" ADD CONSTRAINT "supplier_address_to_supplier" FOREIGN KEY ("id_supplier") REFERENCES "energy_supplier" ("id");

ALTER TABLE "address" ADD CONSTRAINT "address_to_city" FOREIGN KEY ("id_city") REFERENCES "city" ("id");

ALTER TABLE "address" ADD CONSTRAINT "address_to_district" FOREIGN KEY ("id_district") REFERENCES "district" ("id");

ALTER TABLE "address" ADD CONSTRAINT "address_to_country" FOREIGN KEY ("id_country") REFERENCES "country" ("id");

ALTER TABLE "ppe" ADD CONSTRAINT "ppe_to_customer" FOREIGN KEY ("id_customer") REFERENCES "customer" ("id");

ALTER TABLE "ppe" ADD CONSTRAINT "ppe_to_address" FOREIGN KEY ("id_address") REFERENCES "address" ("id");

ALTER TABLE "supplier_offer" ADD CONSTRAINT "supplier_offer_to_supplier" FOREIGN KEY ("id_supplier") REFERENCES "energy_supplier" ("id");

ALTER TABLE "supplier_offer" ADD CONSTRAINT "supplier_offer_to_power_unit" FOREIGN KEY ("id_power_unit") REFERENCES "power_unit" ("id");

ALTER TABLE "supplier_offer" ADD CONSTRAINT "supplier_offer_to_tariff" FOREIGN KEY ("id_tariff") REFERENCES "energy_tariff" ("id");

ALTER TABLE "supplier_offer" ADD CONSTRAINT "supplier_offer_to_currency" FOREIGN KEY ("id_currency_unit") REFERENCES "currency_unit" ("id");
