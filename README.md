# EnerLink
> Customer Relationship Management System for Energy Vendor (CRM)

## Project description

The goal of the CRM system is to improve sales, marketing, and customer service processes by collecting, analyzing, and using customer data. The system includes a database of customers, contracts, and energy sales representatives divided into teams managed by managers. It also enables monitoring of customer interactions and ongoing sales performance.

> Live demo [_here_](https://www.enerlink.com).

## Table of Contents
* [Functional Requierements](#Functional Requierements)
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Usage](#usage)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)
* [License](#license)

## Functional Requierements
Detailed functional requirements are described in the following document:  
[View Functional Requirements](./documentation/functional_requirements.md)

## Database
Databese is described in the following document:  
[View Database description](./documentation/database_info.md)

## General Information
EnerLink is a CRM platform for energy vendors, designed to streamline customer management, contract tracking, and sales analysis.  
The system supports multiple user roles — **administrators, managers, and sales representatives** — providing tailored dashboards and access permissions.

## Technologies Used

### **Frontend**
- React `^19.2.0`
- TypeScript `^4.9.5`
- React Scripts `5.0.1`
- React Testing Library
- Jest
- Web Vitals

### **Backend**
- Flask `3.1.2`
- Flask-SQLAlchemy `3.0.5`
- psycopg2-binary `2.9.9`
- SQLAlchemy `2.0.44`
- Werkzeug `3.1.3`
- Jinja2 `3.1.6`
- pytest `8.4.0`
- Swagger for API documentation

### **Database**
- PostgreSQL


## Features
- Role-based user management (Admin / Manager / Sales Representative)
- Customer and contract management
- Energy provider and tariff database
- Analytics dashboards and team performance ranking
- Tag and label system for categorization
- Secure authentication with password policies
- Swagger-based REST API documentation


## Screenshots
![Example screenshot](./img/screenshot.png)

## Setup
### 1 **Clone the repository**
```bash
git clone https://github.com/RockPiryt/Projekt_zespolowy_UG.git
cd Projekt_zespolowy_UG
```
###  2 Backend setup
```bash
cd backend
python -m venv venv        # create venv
source venv/bin/activate   # on macOS/Linux
venv\Scripts\activate      # on Windows

# install 
pip install -r requirements.txt

# set
FLASK_APP=wsgi.py
FLASK_ENV=development

```

###  3 Set up PostgreSQL and configure environment variables (for example in .env file):
```bash
DATABASE_URL=postgresql://ener:link@localhost:5432/enerlink_db
FLASK_ENV=development
SECRET_KEY=your_secret_key
```

Run database migrations (if you use Alembic or manually initialize tables):
```bash
flask shell
>>> from app import db
>>> db.create_all()
>>> exit()
```

###  4 Frontend setup
```bash
cd ../frontend
npm install
npm start
```

### 5 Running the Application
Start Backend (Flask)
```bash
cd backend
flask run
```

Start Frontend (React)
```bash
cd frontend
npm start
```

Now open your browser and go to http://localhost:3000


## API Documentation (Swagger)

EnerLink uses Swagger UI for live API documentation.
Once the Flask server is running, open:
```bash
🔗 http://localhost:5000/api/docs
```
The Swagger YAML file is located at:
backend/swagger/swagger.yaml



## Project Status
Project is: _in progress_ 

## Room for Improvement

- Add Docker configuration for easier deployment

- Implement unit and integration tests

- Enhance UI with modern dashboard components (charts, analytics)

- Introduce JWT authentication


## Contact
Created by:
- Rafał Arnista
- Mariusz Dudzik
- Marcin Gierszewski
- Paulina Kimak [@rockpiryt](https://www.paulinakimak.pl/)


## License
This project is open source and available under the Apache License 2.0