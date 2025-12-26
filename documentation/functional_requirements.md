FUNCTIONAL REQUIREMENTS
## 1. Administrator Panel – User Management

### a) Roles
- Create roles for users (e.g. sales representative, manager, administrator)
- Change user roles
- Assign permissions to roles
- Modify permissions for roles
- Maintain a history of role and permission changes

### b) Users
- Create user (first name, last name, email, password, unique employee number, role)
- Validate entered data
- Edit user data (first name, last name, email, role)
- Ability to block/unblock a user account

## 2. User Login Panel
a) Login
- Enter user number and password to log in
- Force first-time password change to a user-defined password
- Force password change every 90 days
- Allow user to change password
- Password reset via link sent to email
- Automatic account lock after 5 failed login attempts
- Login and user status change history

### 3. Addresses

## a) City Database
- Add cities to the database
- Edit cities in the database
- Deactivate/activate cities
- Import cities automatically from external databases

## b) Country Database
- Add countries to the database
- Edit countries in the database
- Deactivate/activate countries
- Import countries automatically from external databases

c) Province Database

Add provinces to the database

Edit provinces in the database

Deactivate/activate provinces

Import provinces automatically from external databases

d) PKWiU Database (Polish Classification of Goods and Services)

Automatic import of PKWiU database

Add PKWiU codes manually

Edit PKWiU data

Deactivate/activate PKWiU entries

e) Energy Tariff Database

Add energy tariffs

Edit energy tariffs

Deactivate/activate tariffs

4. Customer Data Panel

a) Contact Information

Create customer

Individual: first name, last name, email, phone, address (street, building number, apartment number, postal code, city, province, country), PESEL, PPE info

Business: company name, email, phone, address (street, building number, apartment number, postal code, city, province, country), NIP, PKWiU, REGON, representative

Edit customer data (all fields except NIP, PESEL, REGON)

Deactivate/activate customer

b) Contract Data

Enter contracts (contract number, date of signing, validity period, provider, tariff, price per kWh, customer data)

Edit contract data

Delete contract

Contract statuses (reservation, verification, contract signed)

Contract status change history

5. Energy Provider Panel

a) Contact Information

Create energy provider (name, address)

Edit address data

Activate/deactivate provider

b) Product Data

Add offered tariffs (name, price, validity period)

Edit tariffs

Delete tariffs

6. Sales Representative Panel

a) Customer Management

Assign customers to sales representatives

History of customer contacts and contact methods

Track contract status changes

Search customers by name and surname

Remove customers from a representative’s portfolio

Manage customer contracts

Transfer contracts between representatives

Customer notes

Reserve list (customers with no activity in the last 30 days)

b) Analytics

Generate list of assigned customers

List of customer contracts

Charts showing number of contracts per month and per year

Charts showing number of acquired customers per month and per year

Search by customer data (NIP, PESEL, company name)

Filter by customer record fields

Sort by customer addition date

Contracts expiring within 30 days

Sort customer records by creation date (ascending/descending)

Sort alphabetically (by surname/company name)

7. Team Manager Panel

a) Sales Ranking

Sort by number of sales in a given month

Analyze team performance

Dashboard with charts on salesperson efficiency

b) Reports and Analytics

Generate sales reports
Generate customer service reports
Export data to XLSX files

8. Tag and Label System

Ability to add tags to customers and contracts to facilitate categorization and filtering (e.g. “VIP”, “To Recover”, “Long Process”, “Promotion”)

Users with appropriate permissions can create and manage tags

Ability to filter, sort, and search records by tags