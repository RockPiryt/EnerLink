# EnerLink
> Customer Relationship Management System for Energy Vendor (CRM)

## Project description

The goal of the CRM system is to improve sales, marketing, and customer service processes by collecting, analyzing, and using customer data. The system includes a database of customers, contracts, and energy sales representatives divided into teams managed by managers. It also enables monitoring of customer interactions and ongoing sales performance.

## Table of Contents
* [General Info](#general-information)
* [Features](#features)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Usage](#usage)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)
* [Technologies Used](#technologies-used)
* [Contact](#contact)
* [License](#license)

## General Information
EnerLink is a CRM platform for energy vendors, designed to streamline customer management, contract tracking, and sales analysis.  
The system supports multiple user roles — **administrators, managers, and sales representatives** — providing tailored dashboards and access permissions.

## Setup project
[View Setup project](./documentation/setup_project.md)


## Screenshots
[Screenshots](./documentation/screenshots.md)

## Functional Requirements
Detailed functional requirements are described in the following document:  
[View Functional Requirements](./documentation/functional_requirements.md)

## Diagrams
### Use Case Diagrams 
Use Case diagrams in the following document:
[View Use case diagrams](./documentation/use_case_diagrams_info.md)

### Activity Diagrams 
Activity diagrams in the following document:
[View Activity diagrams](./documentation/activity_diagrams_info.md)

### Sequence Diagrams 
Sequence diagrams in the following document:
[View Sequence diagrams](./documentation/sequence_diagrams_info.md)

### Class Diagram 
Class diagram in the following document:
[View Class diagram](./documentation/class_diagram_info.md)

## Database
Database is described in the following document:  
[View Database description](./documentation/database_info.md)

- PostgreSQL - production
- SQLite - dev, tests



## Technologies Used
### Frontend
React ^19.2.0
TypeScript ^4.9.5
React Scripts (CRA) 5.0.1
React Router DOM ^7.9.5
Axios ^1.13.2
Bootstrap ^5.3.8
React Bootstrap ^2.10.10
Web Vitals ^2.1.4

### Testing (Frontend)
Jest

React Testing Library
@testing-library/react ^16.3.0
@testing-library/jest-dom ^6.9.1
@testing-library/user-event ^13.5.0

Type definitions
@types/react ^19.2.2
@types/react-dom ^19.2.1
@types/jest ^27.5.2
@types/node ^16.18.126

### Backend

Python >=3.11
Flask 3.1.2
Flask-SQLAlchemy 3.0.5
SQLAlchemy 2.0.44
Flask-Migrate 4.0.7
Flask-CORS 6.0.2
Flasgger (Swagger UI) 0.9.7.1
psycopg2-binary 2.9.9 (PostgreSQL driver)
python-dotenv 1.0.1

Backend Utilities
Werkzeug 3.1.3
Jinja2 3.1.6
MarkupSafe 3.0.3
itsdangerous 2.2.0
greenlet 3.2.4
Testing (Backend)
pytest 8.4.0
attrs 25.4.0
pluggy 1.6.0
iniconfig 2.1.0

### API & Documentation
Swagger / OpenAPI
Flasgger UI
openapi.yaml

JSON Schema
jsonschema 4.25.1
jsonschema-specifications 2025.9.1

### DevOps / Tooling
Node.js >=20.0.0
npm >=9.0.0
Git
dotenv (.env) configuration
Mako 1.3.10 (migrations / templating)
PyYAML 6.0.3
Pygments 2.19.2 (syntax highlighting, docs)
Mistune 3.1.4 (Markdown)

### Database
PostgreSQL (via psycopg2 + SQLAlchemy)

### Architecture & Paradigms
RESTful API
MVC (Flask + SQLAlchemy)
SPA (React)
Role-Based Access Control (RBAC)
JWT / Session-based authentication
Modular architecture (services, routes, components)

## Features
- Role-based user management (Admin / Manager / Sales Representative)
- Customer and contract management
- Energy provider and tariff database
- Analytics dashboards and team performance ranking
- Tag system for categorization
- Secure authentication with hashed passwords and roles
- Swagger-based REST API documentation

## Screenshots
![Example screenshot](./img/screenshot.png)

## API Documentation (Swagger)

EnerLink uses Swagger UI for live API documentation.

The Swagger YAML file is located at:
backend/oneapi.yaml

Once the Flask server (flask run) is running, open:
```bash
 http://localhost:8080/apidocs/
```

![Swagger](./documentation/images/swagger.png)

More info abiut api: 
[View Oneapi](./documentation/oneapi.md)
[View Rest Api](./documentation/rest_api.md)

## Test
Pytest was used to test project.
```bash
pytest -q
pytest -q tests/test_address_routes.py
pytest -q tests/test_address_routes.py::test_get_countries_empty

-x do porażki
-vv verbose
--lf tylko nieudane
```

## Project Status
Project is: _in progress_ 

## Room for Improvement
- Add Docker configuration for easier deployment
- Implement integration tests
- Enhance UI with modern dashboard components (charts, analytics)
- Introduce JWT authentication
- Use services (not only routes) - analytics_service.py, contract_service.py, customer_service.py, user_service.py

## Contact
Created by:
- Rafał Arnista
- Mariusz Dudzik
- Marcin Gierszewski
- Paulina Kimak [@rockpiryt](https://www.paulinakimak.pl/)

## License
This project is open source and available under the Apache License 2.0