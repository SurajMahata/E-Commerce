# ShopVerse Ecommerce Project

Full-stack ecommerce website with a React frontend, Spring Boot Maven backend, JWT authentication, MySQL persistence, product search/details, cart, checkout, orders and admin product management.

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Spring Boot 3, Maven, Spring Security, JWT, Spring Data JPA
- Database: MySQL

## Backend Setup

1. Start MySQL.
2. Run `backend/database-setup.sql` in MySQL Workbench or the MySQL command line.
3. Update credentials in `backend/src/main/resources/application.properties` if your MySQL username/password is not `root/suraj9971`.
4. Run:
3. Run:

```bash
cd backend
mvn spring-boot:run
```

The backend runs at `http://localhost:8080`.

When register works, new users are saved in:

```sql
SELECT id, name, email, role, created_at FROM ecommerce_db.users;
```

## Register/Login Database Checklist

Use these exact values first:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=suraj9971
```

In MySQL Workbench, run:

```sql
CREATE DATABASE IF NOT EXISTS ecommerce_db;
SHOW DATABASES;
USE ecommerce_db;
SHOW TABLES;
SELECT id, name, email, role, created_at FROM users;
```

If `SHOW TABLES;` is empty, the Spring Boot backend has not started successfully yet. Start the backend and watch the terminal; it should print Hibernate SQL and create tables like `users`, `products`, `cart_items`, `orders`, and `order_items`.

If the React register page says `Failed to fetch`, the backend is not running at `http://localhost:8080`.

Seeded admin login:

```text
admin@shopverse.com
Admin123
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products` admin only
- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart/{itemId}?quantity=2`
- `POST /api/orders/checkout`
- `GET /api/orders`

## Pages Included

- Home
- Register
- Login
- Products
- Product Details
- Cart
- Checkout
- Orders
- Admin Product Management

Admin accounts do not see cart or checkout. Cart and order APIs are customer-only, while product create/update/delete APIs are admin-only.
