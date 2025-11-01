 1. Administrator Panel – User Management (user_routes.py, role_routes.py)
/api/users
Metoda	    Endpoint	                    Opis
GET	        /api/users	                    Lista użytkowników
POST	    /api/users	                    Dodaj nowego użytkownika
GET	        /api/users/<id>	                Pobierz dane użytkownika
PUT	        /api/users/<id>	                Edytuj dane użytkownika
PATCH	    /api/users/<id>/block	        Zablokuj / odblokuj użytkownika
GET	        /api/users/history	Historia zmian użytkowników
GET	        /api/users/logs	Historia logowań użytkowników

/api/roles
Metoda	Endpoint	Opis
GET	/api/roles	Lista ról
POST	/api/roles	Dodaj nową rolę
PUT	/api/roles/<id>	Edytuj rolę
PATCH	/api/roles/<id>/permissions	Zmień uprawnienia
GET	/api/roles/history	Historia zmian ról

 2. User Login Panel (auth_routes.py)
Metoda	Endpoint	Opis
POST	/api/auth/login	Logowanie użytkownika
POST	/api/auth/logout	Wylogowanie
POST	/api/auth/change-password	Zmiana hasła
POST	/api/auth/reset-password	Reset hasła (link email)
GET	/api/auth/status	Sprawdź status użytkownika
GET	/api/auth/logs	Historia logowań użytkownika


 3. Dictionary Data Panel (dictionary_routes.py)
/api/dictionary/countries

| Metoda | Endpoint | Opis |
| GET | /api/dictionary/countries | Lista krajów |
| POST | /api/dictionary/countries | Dodaj kraj |
| PUT | /api/dictionary/countries/<id> | Edytuj kraj |
| PATCH | /api/dictionary/countries/<id>/status | Aktywuj/deaktywuj kraj |

/api/dictionary/cities, /provinces, /pkwiu, /tariffs

Wszystkie mają podobny zestaw endpointów:
| GET | /api/dictionary/<table> | Lista |
| POST | /api/dictionary/<table> | Dodaj |
| PUT | /api/dictionary/<table>/<id> | Edytuj |
| PATCH | /api/dictionary/<table>/<id>/status | Aktywuj/deaktywuj |
| POST | /api/dictionary/<table>/import | Import danych (zewnętrzna baza) |

 4. Customer Data Panel (customer_routes.py, contract_routes.py)
/api/customers

| Metoda | Endpoint | Opis |
| GET | /api/customers | Lista klientów |
| POST | /api/customers | Utwórz klienta |
| GET | /api/customers/<id> | Szczegóły klienta |
| PUT | /api/customers/<id> | Edytuj dane klienta |
| PATCH | /api/customers/<id>/status | Aktywuj/deaktywuj klienta |

/api/contracts

| Metoda | Endpoint | Opis |
| GET | /api/contracts | Lista umów |
| POST | /api/contracts | Dodaj umowę |
| GET | /api/contracts/<id> | Pobierz umowę |
| PUT | /api/contracts/<id> | Edytuj umowę |
| DELETE | /api/contracts/<id> | Usuń umowę |
| PATCH | /api/contracts/<id>/status | Zmień status umowy |
| GET | /api/contracts/history | Historia zmian statusu |

 5. Energy Provider Panel (provider_routes.py)
/api/providers

| Metoda | Endpoint | Opis |
| GET | /api/providers | Lista dostawców |
| POST | /api/providers | Dodaj dostawcę |
| PUT | /api/providers/<id> | Edytuj dane dostawcy |
| PATCH | /api/providers/<id>/status | Aktywuj/deaktywuj |

/api/providers/<id>/offers

| Metoda | Endpoint | Opis |
| GET | /api/providers/<id>/offers | Lista ofert |
| POST | /api/providers/<id>/offers | Dodaj ofertę |
| PUT | /api/providers/offers/<id> | Edytuj ofertę |
| DELETE | /api/providers/offers/<id> | Usuń ofertę |

 6. Sales Representative Panel (sales_routes.py)
/api/sales/customers

| Metoda | Endpoint | Opis |
| GET | /api/sales/customers | Lista przypisanych klientów |
| POST | /api/sales/customers/<id>/assign | Przypisz klienta |
| DELETE | /api/sales/customers/<id>/remove | Usuń klienta |
| GET | /api/sales/customers/<id>/notes | Pobierz notatki klienta |
| POST | /api/sales/customers/<id>/notes | Dodaj notatkę |
| GET | /api/sales/analytics/contracts | Analiza umów (liczba/miesiąc/rok) |

 7. Team Manager Panel (manager_routes.py)
/api/manager/reports

| Metoda | Endpoint | Opis |
| GET | /api/manager/ranking | Ranking sprzedaży |
| GET | /api/manager/analytics/team | Dashboard efektywności |
| GET | /api/manager/reports/sales | Raport sprzedaży |
| GET | /api/manager/reports/customers | Raport obsługi klientów |
| GET | /api/manager/reports/export/xlsx | Eksport raportu do XLSX |

 8. Tag and Label System (tag_routes.py)
/api/tags

| Metoda | Endpoint | Opis |
| GET | /api/tags | Lista tagów |
| POST | /api/tags | Dodaj nowy tag |
| PUT | /api/tags/<id> | Edytuj tag |
| DELETE | /api/tags/<id> | Usuń tag |

/api/tags/assign

| POST | /api/tags/assign | Przypisz tag do klienta lub umowy |
| DELETE | /api/tags/unassign | Usuń tag z klienta lub umowy |