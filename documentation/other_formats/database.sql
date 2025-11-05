-- User Passwords
CREATE TABLE user_passwords (
    id SERIAL PRIMARY KEY,
    password VARCHAR(150) NOT NULL,
    failed_attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    id_password INTEGER NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_password FOREIGN KEY (id_password) REFERENCES user_passwords(id)

);

-- User Roles
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tags
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PKWiU (Classification codes)
CREATE TABLE pkwius (
     id SERIAL PRIMARY KEY,
     pkwiu_nr VARCHAR(20) NOT NULL,
     pkwiu_name VARCHAR(200) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Countries
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    shortcut VARCHAR(5) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Districts
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cities
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Addresses
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    street_name VARCHAR(100),
    building_nr VARCHAR(10),
    apartment_nr VARCHAR(10),
    post_code VARCHAR(20),
    id_city INTEGER,
    id_district INTEGER,
    id_country INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_addresses_city FOREIGN KEY (id_city) REFERENCES cities(id),
    CONSTRAINT fk_addresses_district FOREIGN KEY (id_district) REFERENCES districts(id),
    CONSTRAINT fk_addresses_country FOREIGN KEY (id_country) REFERENCES countries(id)
);

-- Customers
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    id_document INTEGER,
    id_pkwiu INTEGER,
    user_id INTEGER NOT NULL,
    tag_id INTEGER,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    company VARCHAR(300),
    contact_email VARCHAR(100),
    phone VARCHAR(20),
    pesel VARCHAR(15),
    nip VARCHAR(20),
    regon VARCHAR(14),
    representative_name VARCHAR(100),
    is_company BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customers_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_customers_tag FOREIGN KEY (tag_id) REFERENCES tags(id),
    CONSTRAINT fk_customers_pkwiu FOREIGN KEY (id_pkwiu) REFERENCES pkwius(id)
);

-- Customer Addresses (junction table)
CREATE TABLE customer_addresses (
    id SERIAL PRIMARY KEY,
    id_address INTEGER NOT NULL,
    id_customer INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_addresses_customer FOREIGN KEY (id_customer) REFERENCES customers(id),
    CONSTRAINT fk_customer_addresses_address FOREIGN KEY (id_address) REFERENCES addresses(id)
);

-- Customer PPEs (Point of Power Extraction)
CREATE TABLE customer_ppes (
    id SERIAL PRIMARY KEY,
    id_customer_address INTEGER NOT NULL,
    ppe_number VARCHAR(50),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_ppes_address FOREIGN KEY (id_customer_address) REFERENCES customer_addresses(id)
);

-- Customer Reservations
CREATE TABLE customer_reservations (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_reservations_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Energy Suppliers
CREATE TABLE energy_suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Energy Tariffs
CREATE TABLE energy_tariffs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Supplier Offers
CREATE TABLE supplier_offers (
    id SERIAL PRIMARY KEY,
    id_supplier INTEGER NOT NULL,
    id_tariff INTEGER NOT NULL,
    power_unit VARCHAR(10) DEFAULT 'kWh',
    currency_unit VARCHAR(5) DEFAULT 'PLN',
    price DECIMAL(10, 4) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_supplier_offers_supplier FOREIGN KEY (id_supplier) REFERENCES energy_suppliers(id),
    CONSTRAINT fk_supplier_offers_tariff FOREIGN KEY (id_tariff) REFERENCES energy_tariffs(id)
);

-- Contracts
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    id_supplier_offer INTEGER NOT NULL,
    tag_id INTEGER,
    contract_number VARCHAR(150) UNIQUE NOT NULL,
    signed_at DATE,
    contract_from DATE NOT NULL,
    contract_to DATE NOT NULL,
    supplier_offer VARCHAR(300),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contracts_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_contracts_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_contracts_supplier_offer FOREIGN KEY (id_supplier_offer) REFERENCES supplier_offers(id),
    CONSTRAINT fk_contracts_tag FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Contract Status Timelines
CREATE TABLE contract_status_timelines (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contract_status_contract FOREIGN KEY (contract_id) REFERENCES contracts(id)
);

-- Manager Subordinates (hierarchy)
CREATE TABLE manager_subordinates (
    id SERIAL PRIMARY KEY,
    manager_id INTEGER NOT NULL,
    subordinate_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_manager_subordinates_manager FOREIGN KEY (manager_id) REFERENCES users(id),
    CONSTRAINT fk_manager_subordinates_subordinate FOREIGN KEY (subordinate_id) REFERENCES users(id),
    CONSTRAINT uk_manager_subordinate UNIQUE (manager_id, subordinate_id)
);

-- User Log Histories
CREATE TABLE user_log_histories (
    id SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_log_histories_user FOREIGN KEY (id_user) REFERENCES users(id)
);

-- User Change Histories
CREATE TABLE user_change_histories (
    id SERIAL PRIMARY KEY,
    id_user_who_changed INTEGER NOT NULL,
    id_user_changed INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_change_who FOREIGN KEY (id_user_who_changed) REFERENCES users(id),
    CONSTRAINT fk_user_change_target FOREIGN KEY (id_user_changed) REFERENCES users(id)
);

-- Role Change Histories
CREATE TABLE role_change_histories (
    id SERIAL PRIMARY KEY,
    id_user_who_changed INTEGER NOT NULL,
    id_role INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_role_change_who FOREIGN KEY (id_user_who_changed) REFERENCES users(id),
    CONSTRAINT fk_role_change_role FOREIGN KEY (id_role) REFERENCES user_roles(id)
);