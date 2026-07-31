# CMS Assignment Backend

A RESTful Content Management System (CMS) Backend built with **Laravel 12**. This project provides secure authentication, role-based access control, menu management, page management, role management, user management, file uploads, and interactive API documentation using Swagger/OpenAPI.

---

## Features

- Laravel 12.x REST API
- Laravel Sanctum Authentication
- Role & Permission Management (Spatie Laravel Permission)
- User Management
- Menu Management (Nested Menus)
- Page Management
- Image Upload Support
- Pagination
- Search & Filtering
- Form Request Validation
- API Resources
- Soft Deletes
- OpenAPI / Swagger Documentation
- Standard JSON API Responses

---

## Tech Stack

- PHP 8.2+
- Laravel 12.x
- MySQL
- Laravel Sanctum
- Spatie Laravel Permission
- L5 Swagger
- Composer

---

# Installation

Clone the repository

```bash
git clone https://github.com/ihsansaleemkhan/cms-assignment.git
cd cms-assignment-backend
```

Install dependencies

```bash
composer install
```

Copy environment file

```bash
cp .env.example .env
```

Generate application key

```bash
php artisan key:generate
```

Configure your database inside `.env`

Run migrations and seeders

```bash
php artisan migrate --seed
```

Create storage symlink

```bash
php artisan storage:link
```

Generate Swagger documentation

```bash
php artisan l5-swagger:generate
```

Start the server

```bash
php artisan serve
```

---

# Authentication

Authentication is implemented using **Laravel Sanctum**.

Login endpoint

```
POST /api/login
```

After successful login, include the returned token in every protected request.

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# API Documentation

Swagger UI

```
http://127.0.0.1:8000/api/documentation
```

Regenerate documentation after modifying annotations

```bash
php artisan l5-swagger:generate
```

---

# API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/login |
| GET | /api/me |
| POST | /api/logout |

---

## Menus

| Method | Endpoint |
|---------|----------|
| GET | /api/menus |
| POST | /api/menus |
| GET | /api/menus/{id} |
| PUT | /api/menus/{id} |
| DELETE | /api/menus/{id} |

Supports

- Nested menus
- Search
- Pagination

---

## Pages

| Method | Endpoint |
|---------|----------|
| GET | /api/pages |
| POST | /api/pages |
| GET | /api/pages/{id} |
| PUT | /api/pages/{id} |
| DELETE | /api/pages/{id} |

Supports

- Image upload
- Search
- Menu filtering
- Status filtering
- Pagination

---

## Roles

| Method | Endpoint |
|---------|----------|
| GET | /api/roles |
| POST | /api/roles |
| GET | /api/roles/{id} |
| PUT | /api/roles/{id} |
| DELETE | /api/roles/{id} |

Supports

- Permission assignment
- Search
- Pagination

---

## Users

| Method | Endpoint |
|---------|----------|
| GET | /api/users |
| POST | /api/users |
| GET | /api/users/{id} |
| PUT | /api/users/{id} |
| DELETE | /api/users/{id} |

Supports

- Role assignment
- Search
- Pagination

---

# Role Based Access Control

Implemented using **Spatie Laravel Permission**.

Permissions include:

- menu.view
- menu.create
- menu.edit
- menu.delete

- page.view
- page.create
- page.edit
- page.delete

- role.view
- role.create
- role.edit
- role.delete

- user.view
- user.create
- user.edit
- user.delete

---

# Validation

Validation is implemented using dedicated Form Request classes.

- LoginRequest
- StoreMenuRequest
- UpdateMenuRequest
- StorePageRequest
- UpdatePageRequest
- StoreRoleRequest
- UpdateRoleRequest
- StoreUserRequest
- UpdateUserRequest

---

# Project Structure

```
app/
 ├── Http/
 │    ├── Controllers/
 │    ├── Requests/
 │    ├── Resources/
 ├── Models/
database/
 ├── migrations/
 ├── seeders/
routes/
 ├── api.php
```

---

# Default Seed Data

The database seeder creates the following default data:

## Roles

- System Administrator
- Content Manager
- Content Moderator
- Viewer

## Permissions

The following permission groups are seeded:

- Dashboard Permissions
- Menu Permissions
- Page Permissions
- User Permissions
- Role Permissions

## Default Users

| Role | Email | Password |
|------|--------|----------|
| System Administrator | admin@cms.com | Password@123 |
| Content Manager | manager@cms.com | Password@123 |
| Content Moderator | moderator@cms.com | Password@123 |
| Viewer | viewer@cms.com | Password@123 |

Run the following command to create the default roles, permissions, and users:

```bash
php artisan migrate --seed
```

---

# Error Handling

The API returns consistent JSON responses for

- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Validation Errors
- 500 Internal Server Error

---

# Assignment Highlights

- Laravel 12
- RESTful API Design
- Sanctum Authentication
- RBAC using Spatie Permission
- CRUD for Menus
- CRUD for Pages
- CRUD for Roles
- CRUD for Users
- OpenAPI Documentation
- Image Uploads
- Pagination
- Search & Filtering
- Soft Deletes
- Clean Architecture using Resources and Form Requests

---

# Author

**Mohomed Ihsan Saleemkhan**

Senior Software Engineer