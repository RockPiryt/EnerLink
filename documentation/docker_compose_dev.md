# EnerLink — uruchamianie projektu - development

## Wymagania

Przed uruchomieniem upewnij się, że masz zainstalowane:

- Docker
- Docker Compose

Sprawdzenie:

```bash
docker --version
docker compose version
```


## Tryb development

```
docker compose -f docker-compose.dev.yaml up --build
```

W osobnym terminalu

Wykonaj migracje bazy:
```
docker compose -f docker-compose.dev.yaml exec backend flask db upgrade
```
Następnie seed db:
```
docker compose -f docker-compose.dev.yaml exec backend python seed_database.py
```

## Strona
Po uruchomieniu frontend będzie dostępny pod adresem:
```
http://localhost:3000
```


## Zatrzymywanie projektu
```
docker compose -f docker-compose.dev.yaml down
```