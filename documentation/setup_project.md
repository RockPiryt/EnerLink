# Setup
## Clone the repository
```bash
git clone https://github.com/RockPiryt/Projekt_zespolowy_UG.git
cd Projekt_zespolowy_UG
```
## Backend setup
```bash
cd backend
python -m venv venv        # create venv
source venv/bin/activate   # on macOS/Linux
venv\Scripts\activate      # on Windows

# Install dependencies
pip install -r requirements.txt
```

### Set environment variables 

 macOS / Linux (bash / zsh)
```bash
FLASK_APP=wsgi.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
```

Windows (PowerShell)
$env:FLASK_APP = "wsgi.py"
$env:FLASK_ENV = "development"
$env:SECRET_KEY="your_secret_key"

## Initialize the database
```bash
flask db init
flask db migrate -m "Initial tables"
flask db upgrade
```

- flask db init – creates a new folder migrations/ with Alembic configuration (only once per project).

- flask db migrate -m "Initial tables" – generates migration scripts based on your SQLAlchemy models.

- flask db upgrade – applies all migrations to your database (creates tables and schema).

##  Frontend setup
- Before running the frontend, please ensure you have Node.js version 24.0.0 or higher and npm version 11.0.0 or higher installed.
- Create an .env file based on the .env.example template.
- Install dependencies using npm install. If you occur any errors, try running npm install --legacy-peer-deps.

```bash
cd ../frontend
npm install
npm start
```

## Running the Application
Start Backend (Flask)
```bash
cd backend
flask run --port=8080
```
Before running the frontend, check if the backend API is working correctly.

## Test endpoint

```
curl http://localhost:8080/api/health

```
Expected response:

{
  "status": "ok"
}


The backend API will now be available at:
http://localhost:8080

Start Frontend (React)
```bash
cd frontend
npm start
```
The frontend will run at:
http://localhost:3000


## Access the App

Open your browser and visit the frontend:
👉 http://localhost:3000

The frontend will communicate with the backend at:
👉 http://localhost:8080/api