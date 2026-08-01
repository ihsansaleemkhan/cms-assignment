# CMS Assignment Backend

Production-minded REST API for a bilingual content-management system built with **Laravel 12**. The backend provides Sanctum authentication, data-driven roles and permissions, nested menus, page publishing, audit metadata, trash management, public content APIs, image uploads, Swagger/OpenAPI documentation, and automated-test support.

## Current Features

- Laravel 12 REST APIs with consistent JSON responses
- Laravel Sanctum bearer-token authentication
- Role and permission management using Spatie Laravel Permission
- Users, roles, permissions, menus, pages, and dashboard APIs
- Sortable, nested menus
- Page drafts and published content
- Optional publish date with public query-time publishing checks
- Cover-image uploads and public storage URLs
- Pagination, title search, menu filtering, and status filtering
- Form Request validation and API Resources
- Audit metadata for pages and menus:
  - `created_by`
  - `updated_by`
  - `deleted_by`
  - timestamps
- Soft-delete trash APIs with restore and permanent deletion
- Admin-only trash permissions
- Public menu and page APIs that return only active, published, due content
- Bilingual English and Arabic fields for menus and pages
- Swagger/OpenAPI documentation served from the application
- Seeders and factories

## Tech Stack

- PHP 8.2+
- Laravel 12.x
- MySQL or PostgreSQL
- Laravel Sanctum
- Spatie Laravel Permission
- L5 Swagger
- PHPUnit or Pest-compatible Laravel test setup
- Composer

## Installation

```bash
git clone https://github.com/ihsansaleemkhan/cms-assignment.git
cd cms-assignment-backend
composer install
```

Copy the environment file and generate the application key:

```bash
cp .env.example .env
php artisan key:generate
```

Configure the database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cms_assignment
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations and seeders:

```bash
php artisan migrate --seed
```

Create the public storage symlink:

```bash
php artisan storage:link
```

Generate Swagger documentation:

```bash
php artisan l5-swagger:generate
```

Start the backend:

```bash
php artisan serve
```

Default local URL:

```text
http://127.0.0.1:8000
```

## Seeded Administrator

| Role | Email | Password |
|---|---|---|
| System Administrator | `admin@cms.com` | `Password@123` |

Use the seeded administrator to access all management, audit-metadata, restore, and force-delete features.

## Authentication

Login:

```http
POST /api/login
```

Example body:

```json
{
  "email": "admin@cms.com",
  "password": "Password@123"
}
```

Use the returned token for protected APIs:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/json
```

Other authentication endpoints:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | Sign in and create a Sanctum token |
| GET | `/api/me` | Get the authenticated user and permissions |
| POST | `/api/logout` | Revoke the current token |

## Swagger / OpenAPI

Open Swagger UI at:

```text
http://127.0.0.1:8000/api/documentation
```

Regenerate documentation after changing annotations:

```bash
php artisan l5-swagger:generate
```

## Main Protected APIs

### Dashboard

| Method | Endpoint |
|---|---|
| GET | `/api/dashboard` |

### Menus

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/menus` | Paginated menu list |
| GET | `/api/menus/all` | Menu tree/options list |
| POST | `/api/menus` | Create a menu |
| GET | `/api/menus/{menu}` | View a menu |
| PUT/PATCH | `/api/menus/{menu}` | Update a menu |
| DELETE | `/api/menus/{menu}` | Soft-delete a menu |
| PUT | `/api/menus/reorder` | Update menu nesting and sort order |

Menus support:

- Nested parent/child relationships
- Sort order
- Active/inactive state
- English `title`
- Arabic `title_ar`
- Slug
- Audit metadata

### Menu Trash

| Method | Endpoint | Permission |
|---|---|---|
| GET | `/api/menus/trash` | `menu.trash.view` |
| POST | `/api/menus/{id}/restore` | `menu.restore` |
| DELETE | `/api/menus/{id}/force-delete` | `menu.force_delete` |

### Pages

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/pages` | Paginated, searchable, filterable page list |
| POST | `/api/pages` | Create a page |
| GET | `/api/pages/{page}` | View a page |
| PUT/PATCH | `/api/pages/{page}` | Update a page |
| DELETE | `/api/pages/{page}` | Soft-delete a page |

Page fields include:

- `menu_id`
- `title`
- `title_ar`
- `slug`
- `body`
- `body_ar`
- `cover_image`
- `status` (`draft` or `published`)
- `publish_date`
- `created_by`
- `updated_by`
- `deleted_by`
- timestamps

The page list supports:

- Pagination
- Search by title
- Menu filtering
- Status filtering

### Page Trash

| Method | Endpoint | Permission |
|---|---|---|
| GET | `/api/pages/trash` | `page.trash.view` |
| POST | `/api/pages/{id}/restore` | `page.restore` |
| DELETE | `/api/pages/{id}/force-delete` | `page.force_delete` |

### Users

| Method | Endpoint |
|---|---|
| GET | `/api/users` |
| POST | `/api/users` |
| GET | `/api/users/{user}` |
| PUT/PATCH | `/api/users/{user}` |
| DELETE | `/api/users/{user}` |

### Roles

| Method | Endpoint |
|---|---|
| GET | `/api/roles` |
| POST | `/api/roles` |
| GET | `/api/roles/{role}` |
| PUT/PATCH | `/api/roles/{role}` |
| DELETE | `/api/roles/{role}` |

### Permissions

| Method | Endpoint |
|---|---|
| GET | `/api/permissions` |

## Public APIs

Public endpoints do not require authentication. They return only publicly available content.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/public/menus` | Active nested menus with published, due pages |
| GET | `/api/public/pages` | Paginated published, due pages |
| GET | `/api/public/pages/{slug}` | One published, due page by slug |

A page is publicly visible only when:

- `status` is `published`
- it is not soft-deleted
- its menu is active and not soft-deleted
- `publish_date` is null or less than/equal to the current time

## Roles and Permissions

Privileges are stored in the database and checked by permission name. Controllers and routes do not rely on hard-coded role-name checks.

Seeded roles:

- System Administrator
- Content Manager
- Moderator
- Viewer

Core permissions:

```text
dashboard.view

menu.view
menu.create
menu.edit
menu.delete
menu.trash.view
menu.restore
menu.force_delete

page.view
page.create
page.edit
page.delete
page.trash.view
page.restore
page.force_delete

user.view
user.create
user.edit
user.delete

role.view
role.create
role.edit
role.delete
```

The System Administrator receives all seeded permissions. Trash restore and force-delete permissions are not assigned to the other default roles.

## Audit and Trash Behavior

Pages and menus populate audit fields automatically through model events:

- On create: `created_by` and `updated_by`
- On update: `updated_by`
- On soft delete: `deleted_by`

Deleting a record does not immediately remove it from the database. Administrators can restore it or permanently delete it through the dedicated trash endpoints.

This implementation provides record-level audit metadata. It is not a full historical change-log table containing every previous field value.

## Bilingual Content

Menus and pages support optional Arabic fields:

```text
menus.title_ar
pages.title_ar
pages.body_ar
```

English fields remain required. The consuming frontend falls back to English when an Arabic value is empty.

## Validation and Resources

Dedicated Form Requests validate management operations, including:

- Login
- Menu create/update
- Page create/update
- Role create/update
- User create/update

API Resources shape protected, trash, and public responses consistently.

## Automated Tests

Run the test suite with:

```bash
php artisan test
```

Recommended feature-test coverage includes:

- Successful and failed authentication
- Unauthenticated access rejection
- Permission enforcement
- Moderator cannot delete a page
- Non-admin cannot access trash endpoints
- Admin can list, restore, and force-delete trashed pages and menus
- Audit fields are populated
- Future-dated pages are hidden from public APIs
- Published due pages are publicly visible
- Arabic fields are returned correctly

## Useful Commands

```bash
php artisan optimize:clear
php artisan permission:cache-reset
php artisan l5-swagger:generate
php artisan route:list
php artisan test
```

## Project Structure

```text
app/
├── Http/
│   ├── Controllers/Api/
│   ├── Requests/
│   └── Resources/
├── Models/

database/
├── factories/
├── migrations/
└── seeders/

routes/
├── api.php
└── web.php
```


## Author

**Mohomed Ihsan Saleemkhan**  
Senior Software Engineer
