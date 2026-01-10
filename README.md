# EnerLink
> Customer Relationship Management System for Energy Vendor (CRM)

## Table of Contents
* [Project description](#project-descriptionn)
* [Features](#features)
* [Screenshots](#screenshots)
* [Functional Requierements](#functional-requierements)
* [Diagrams](#diagrams)
* [Databases](#databases)
* [Setup](#setup)
API Documentation (Swagger)
* [API Documentation (Swagger)](#api-Documentation-swagger)
* [Tests](#tests)
* [Technologies Used](#technologies-used)
* [Room for Improvement](#room-for-improvement)
* [Project Status](#project-status)
* [Contact](#contact)
* [License](#license)

## Project description
EnerLink is a CRM platform for energy vendors, designed to streamline customer management, contract tracking, and sales analysis.  
The system supports multiple user roles — **administrators, managers, and sales representatives** — providing tailored dashboards and access permissions.

### Main goal
The goal of the CRM system is to improve sales, marketing, and customer service processes by collecting, analyzing, and using customer data. The system includes a database of customers, contracts, and energy sales representatives divided into teams managed by managers. It also enables monitoring of customer interactions and ongoing sales performance.

## Features
- Role-based user management (Admin / Manager / Sales Representative)
- Customer and contract management
- Energy provider and tariff database
- Analytics dashboards and team performance ranking
- Tag system for categorization
- Secure authentication with hashed passwords and roles
- Swagger-based REST API documentation

## Screenshots
###  Main application
![Example screenshot](./documentation/images/enerlink_screenshots/admin_dashboard.png)

### Screenshots
To see screensots from application, please visit: [Screenshots](./documentation/screenshots.md)

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

## Databases
Databases are described in the following document:  
[View Databases description](./documentation/database_info.md)

## Setup project
[View Setup project](./documentation/setup_project.md)

## Technologies Used
### Frontend
- React ^19.2.0
- TypeScript ^4.9.5
- React Scripts (CRA) 5.0.1
- React Router DOM ^7.9.5
- Axios ^1.13.2
- Bootstrap ^5.3.8
- React Bootstrap ^2.10.10
- Web Vitals ^2.1.4

### Testing (Frontend)
- Jest

`React Testing Library`
- @testing-library/react ^16.3.0
- @testing-library/jest-dom ^6.9.1
- @testing-library/user-event ^13.5.0

`Type definitions`
- @types/react ^19.2.2
- @types/react-dom ^19.2.1
- @types/jest ^27.5.2
- @types/node ^16.18.126

### Backend
- Python >=3.11
- Flask 3.1.2
- Flask-SQLAlchemy 3.0.5
- SQLAlchemy 2.0.44
- Flask-Migrate 4.0.7
- Flask-CORS 6.0.2
- Flasgger (Swagger UI) 0.9.7.1
- psycopg2-binary 2.9.9 (PostgreSQL driver)
- python-dotenv 1.0.1

`Backend Utilities`
- Werkzeug 3.1.3
- Jinja2 3.1.6
- MarkupSafe 3.0.3
- itsdangerous 2.2.0
- greenlet 3.2.4

`Testing (Backend)`
- pytest 8.4.0
- attrs 25.4.0
- pluggy 1.6.0
- iniconfig 2.1.0

### API & Documentation
Swagger / OpenAPI
- Flasgger UI
- openapi.yaml

`JSON Schema`
- jsonschema 4.25.1
- jsonschema-specifications 2025.9.1

### Databases
- PostgreSQL (via psycopg2 + SQLAlchemy) - production
- SQLite - dev, tests

### Architecture & Paradigms
- RESTful API
- MVC (Flask + SQLAlchemy)
- SPA (React)
- Role-Based Access Control (RBAC)
- JWT / Session-based authentication
- Modular architecture (services, routes, components)

## Features
- Role-based user management (Admin / Manager / Sales Representative)
- Customer and contract management
- Energy provider and tariff database
- Analytics dashboards and team performance ranking
- Tag system for categorization
- Secure authentication with hashed passwords and roles
- Swagger-based REST API documentation


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

## Tests

### Testing Framework
The project uses pytest as the primary testing framework for backend unit and integration tests.

All tests are located in the tests/ directory and cover the main REST API endpoints (addresses, contracts, customers, providers, roles, users, etc.).

### Running Tests

To run the full test suite:
```
pytest -q
```

To run a specific test file:
```
pytest -q tests/test_address_routes.py
```

To run a single test function:
```
pytest -q tests/test_address_routes.py::test_get_countries_empty
```
Useful pytest options
Option	Description
-q	Quiet output (minimal summary)
-v or -vv	Verbose output (shows all test names and results)
-x	Stop after the first failure
--lf	Run only the tests that failed in the previous run

Example:
```
pytest -vv -x
```

This command runs all tests in verbose mode and stops immediately on the first failure.

Test Scope:
- The test suite verifies:
- Correct behavior of REST API endpoints.
- Proper HTTP status codes and response structures.
- Validation and error handling logic.
- Role-based access control and authorization rules.
- Database interactions and edge cases (e.g. empty datasets, missing resources).


This structure keeps tests modular and aligned with the application’s route architecture.

Configuration

- pytest.ini contains pytest configuration.

- conftest.py defines shared fixtures (e.g. test client, database setup, authentication helpers).

The test environment uses a separate database configuration to avoid modifying production data.


## Room for Improvement
- Add Docker configuration for easier deployment
- Implement integration tests
- Enhance UI with modern dashboard components (charts, analytics)
- Introduce JWT authentication
- Use services (not only routes) - analytics_service.py, contract_service.py, customer_service.py, user_service.py

## Project Status
Project is: _in progress_ 

## Contact
Created by:
- Rafał Arnista
- Mariusz Dudzik
- Marcin Gierszewski
- Paulina Kimak [@rockpiryt](https://www.paulinakimak.pl/)

## License
This project is open source and available under the Apache License 2.0