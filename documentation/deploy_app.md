
# Frontend 

## Build 
docker build -t enerlink-backend .

## Run cointainer
docker run --env-file .env -p 8080:8080 enerlink-backend

env - env variables


## Seed db
docker exec -it enerlink-backend python seed_database.py

python seed_database.py


# Backend
## Build
docker build -t enerlink-frontend .

## Run
docker run -p 3000:3000 enerlink-frontend

REACT_APP_API_URL=http://localhost:8080