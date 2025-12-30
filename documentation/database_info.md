# Database Schema

## Use Case Diagrams
1. Use Case Overview Diagram - showing all actors and main functional blocks in the system, without going into details of each panel.

![Use Case Overview](./documentation/images/use_case_overview.png)
📄 [Download PDF Vesrion](./documentation/other_formats/use_case_overview.pdf)

2. Use Case - User Management
![Use Case User Management](./documentation/images/use_case_user_management.png)
📄 [Download PDF Vesrion](./documentation/other_formats/use_case_user_management.pdf)


## Entity Relationship Diagram
The following diagram illustrates the complete database structure, showing all tables, their relationships, and key constraints.

![Database ERD](./documentation/images/database_erd.png)

📄 [Download PDF Version](./documentation/other_formats/database_schema.pdf)

## SQL Schema File
The complete SQL schema definition can be found in the project documentation. It includes all table structures, foreign key relationships, indexes, and constraints necessary for the application.

For the full SQL implementation, please refer to: [schema.sql](./documentation/other_formats/database.sql)

## Postgres

Initial script 
sudo -u postgres psql -f init_enerlink.sql

Check:
psql -U ener -d enerlink_db -h localhost

