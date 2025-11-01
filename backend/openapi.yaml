swagger: "2.0"
info:
  title: EnerLink API
  version: "1.0.0"
  description: >
    REST API for EnerLink system (mock / backend contract).  
    Backend port: **8080**, Frontend port: **3000**

basePath: /api
host: localhost:8080
schemes:
  - http



paths:

  # USER MANAGEMENT
  /users:
    get:
      summary: "List of users"
      responses:
        200:
          description: "Returns a list of users"
          content:
            application/json:
              example:
                - id: 1
                  first_name: John
                  last_name: Smith
                  email: john@company.com
                  role: manager
                - id: 2
                  first_name: Anna
                  last_name: Brown
                  email: anna@company.com
                  role: sales
    post:
      summary: "Add a new user"
      requestBody:
        required: true
        content:
          application/json:
            example:
              first_name: John
              last_name: Smith
              email: john@company.com
              role: sales
      responses:
        201:
          description: "User created"

  /users/{id}:
    get:
      summary: "Get user details"
      parameters:
        - in: path
          name: id
          schema: { type: integer }
          required: true
      responses:
        200:
          description: "User details"
          content:
            application/json:
              example:
                id: 1
                first_name: John
                last_name: Smith
                email: john@company.com
                role: manager
    put:
      summary: "Edit user data"
      requestBody:
        content:
          application/json:
            example:
              first_name: John
              last_name: Brown
              role: manager
      responses:
        200:
          description: "User updated"
    patch:
      summary: "Block / unblock user"
      responses:
        200:
          description: "User status changed"

  /users/history:
    get:
      summary: "User change history"
      responses:
        200:
          description: "Returns change history"
          content:
            application/json:
              example:
                - user_id: 1
                  action: role_changed
                  date: "2025-10-01T12:00:00Z"

  /users/logs:
    get:
      summary: "User login history"
      responses:
        200:
          description: "List of logins"
          content:
            application/json:
              example:
                - user_id: 1
                  action: login
                  date: "2025-10-01T08:00:00Z"

  # AUTHENTICATION
  /auth/login:
    post:
      summary: "User login"
      requestBody:
        content:
          application/json:
            example:
              username: john
              password: "123456"
      responses:
        200:
          description: "Login successful"
          content:
            application/json:
              example:
                message: "Login successful"
                token: "JWT_TOKEN"

  /auth/logout:
    post:
      summary: "Logout"
      responses:
        200:
          description: "Logged out successfully"

  /auth/change-password:
    post:
      summary: "Change password"
      requestBody:
        content:
          application/json:
            example:
              old_password: "1234"
              new_password: "abcd"
      responses:
        200:
          description: "Password changed"

  /auth/reset-password:
    post:
      summary: "Reset password (email link)"
      requestBody:
        content:
          application/json:
            example:
              email: john@company.com
      responses:
        200:
          description: "Password reset link sent"

  /auth/status:
    get:
      summary: "Check user status"
      responses:
        200:
          description: "Current user status"
          content:
            application/json:
              example:
                user_id: 1
                role: manager
                active: true

  # DICTIONARY DATA
  /dictionary/countries:
    get:
      summary: "List of countries"
      responses:
        200:
          description: "Returns list of countries"
          content:
            application/json:
              example:
                - id: 1
                  name: Poland
                  shortcut: PL
    post:
      summary: "Add country"
      requestBody:
        content:
          application/json:
            example:
              name: Germany
              shortcut: DE
      responses:
        201:
          description: "Country added"

  /dictionary/countries/{id}/status:
    patch:
      summary: "Activate / deactivate country"
      responses:
        200:
          description: "Country status changed"

  # CUSTOMERS
  /customers:
    get:
      summary: "List of customers"
      responses:
        200:
          content:
            application/json:
              example:
                - id: 1
                  company: "XYZ Ltd."
                  email: "contact@xyz.com"
                  active: true
    post:
      summary: "Create customer"
      requestBody:
        content:
          application/json:
            example:
              company: "New Company"
              email: "info@newco.com"
      responses:
        201:
          description: "Customer created"

  /customers/{id}:
    get:
      summary: "Customer details"
      parameters:
        - in: path
          name: id
          schema: { type: integer }
          required: true
      responses:
        200:
          content:
            application/json:
              example:
                id: 1
                company: "XYZ Ltd."
                nip: "1234567890"

  /contracts:
    get:
      summary: "List of contracts"
      responses:
        200:
          content:
            application/json:
              example:
                - id: 1
                  contract_number: U001/2025
                  provider: Energa
                  status: signed
    post:
      summary: "Add contract"
      requestBody:
        content:
          application/json:
            example:
              contract_number: U002/2025
              customer_id: 1
              tariff: G11
              price_kwh: 0.70
      responses:
        201:
          description: "Contract created"

  # PROVIDERS
  /providers:
    get:
      summary: "List of energy providers"
      responses:
        200:
          content:
            application/json:
              example:
                - id: 1
                  name: "Energa"
                - id: 2
                  name: "PGE"
    post:
      summary: "Add energy provider"
      requestBody:
        content:
          application/json:
            example:
              name: "Enea"
      responses:
        201:
          description: "Provider added"

  # SALES PANEL
  /sales/customers:
    get:
      summary: "List of sales representative customers"
      responses:
        200:
          content:
            application/json:
              example:
                - id: 1
                  name: "XYZ Ltd."
                  last_contact: "2025-09-15"
    post:
      summary: "Assign customer to representative"
      requestBody:
        content:
          application/json:
            example:
              customer_id: 1
      responses:
        200:
          description: "Customer assigned"

  /sales/analytics/contracts:
    get:
      summary: "Contract statistics (monthly/yearly)"
      responses:
        200:
          description: "Returns data for charts"
          content:
            application/json:
              example:
                monthly:
                  - month: 9
                    count: 4
                  - month: 10
                    count: 6
                yearly:
                  - year: 2025
                    count: 33

  # MANAGER PANEL
  /manager/ranking:
    get:
      summary: "Sales ranking"
      responses:
        200:
          description: "Returns sales ranking"
          content:
            application/json:
              example:
                - name: John Smith
                  sales: 32
                - name: Anna Brown
                  sales: 28

  # TAGS
  /tags:
    get:
      summary: "List of tags"
      responses:
        200:
          content:
            application/json:
              example:
                - id: 1
                  name: "VIP"
                - id: 2
                  name: "To Recover"
    post:
      summary: "Add tag"
      requestBody:
        content:
          application/json:
            example:
              name: "New Customer"
      responses:
        201:
          description: "Tag added"
