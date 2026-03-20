
# Frontend container

## Build 
docker build -t enerlink-backend .

## Run cointainer
docker run --env-file .env -p 8080:8080 enerlink-backend

env - env variables


## Seed db
docker exec -it enerlink-backend python seed_database.py

python seed_database.py


# Backend container
## Build
docker build -t enerlink-frontend .

## Run
docker run -p 3000:3000 enerlink-frontend

REACT_APP_API_URL=http://localhost:8080



# Docker Compose
docker compose up --build

frontend: http://localhost:3000
backend przez proxy: http://localhost:3000/api
postgres: localhost:5432

## DB migration
docker compose exec backend flask db upgrade

## DB seed
docker compose exec backend python seed_database.py