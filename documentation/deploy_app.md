# EnerLink — Docker Setup

## Struktura projektu

```
.
├── backend/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env
├── docker-compose.yml
└── README.md
```
---

## Szybki start

```bash
docker compose up --build -d
docker compose exec backend flask db upgrade
docker compose exec backend python seed_database.py
```


## Zatrzymanie

```bash
docker compose down
```

Z usunięciem danych bazy:

```bash
docker compose down -v
```

Uwaga: `-v` usuwa wszystkie dane Postgresa.

---
## Dostępne endpointy

### Publiczne
- Frontend: `http://localhost`
- API przez reverse proxy: `http://localhost/api`

### Wewnętrzne porty kontenerów
```
- Frontend (nginx): `80`
- Backend (gunicorn): `8080`
- PostgreSQL: `5432`
```

## Backend Container

### Build

```bash
cd backend
docker build -t enerlink-backend .
```

### Run

```bash
docker run --env-file .env -p 8080:8080 enerlink-backend
```

Backend dostępny pod:

```
http://localhost:8080
```

### Seed bazy danych

Jeśli kontener działa:

```bash
docker exec -it enerlink-backend python seed_database.py
```

---

## Frontend Container

### Build

```bash
cd frontend
docker build -t enerlink-frontend .
```

### Run

```bash
docker run -d --name enerlink-frontend-con -p 3000:80 enerlink-frontend
```

Frontend dostępny pod:

```
http://localhost:3000
```
---

## Docker Compose

Uruchamiaj z głównego folderu projektu:

### Start

```bash
docker compose up --build
```

W tle:

```bash
docker compose up --build -d
```

---


---

## Migracje bazy danych

```bash
docker compose exec backend flask db upgrade
```

---

## Seed bazy danych

```bash
docker compose exec backend python seed_database.py
```

---

## Logi

Wszystkie:

```bash
docker compose logs -f
```

Backend:

```bash
docker compose logs -f backend
```

Frontend:

```bash
docker compose logs -f frontend
```
---

## Najczęstsze problemy

### Backend nie łączy się z bazą

Sprawdź czy dane w `docker-compose.yml` są spójne:

```yaml
POSTGRES_USER: enerlink_user
POSTGRES_PASSWORD: enerlink_password
```

oraz:

```env
DATABASE_URL=postgresql://enerlink_user:enerlink_password@db:5432/enerlink
```