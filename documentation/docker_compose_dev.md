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
docker compose -f docker-compose.dev.yaml build --no-cache
docker compose -f docker-compose.dev.yaml up -d
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
http://127.0.0.1:3000
```


## Zatrzymywanie projektu
```
docker compose -f docker-compose.dev.yaml down
```