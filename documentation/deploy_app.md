## Build 
docker build -t enerlink-backend .

## Run cointainer
docker run --env-file .env -p 8080:8080 enerlink-backend

env - env variables


## Seed db
docker exec -it enerlink-backend python seed_database.py

python seed_database.py