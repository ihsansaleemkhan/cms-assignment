# CMS Assignment Frontend

React and Vite frontend for the Laravel CMS assignment. The application contains a permission-aware administration panel and an attractive public website that consumes the Laravel REST APIs. The public website supports bilingual English/Arabic content and right-to-left layout.

## Features

### Administration Panel

- Sanctum token login
- Protected admin routes under `/admin`
- Permission-aware sidebar and route guards
- Dashboard statistics and latest content tables
- Menu management
- Nested sortable menu tree
- Page management with CKEditor
- Cover-image upload and preview
- Draft/published status and publish-date controls
- English and Arabic menu/page fields
- User management
- Role and permission management
- Audit metadata display
- Audit & Trash screen with separate page and menu tabs
- Restore confirmation
- Force-delete confirmation
- Server-side pagination and search
- Toast notifications and API error handling

### Public Website

- Dynamic header navigation from the public menu API
- Responsive desktop and mobile navigation
- Hero and featured-content sections
- Dynamic page cards and menu sections
- Searchable, paginated menu pages
- Public page-detail rendering
- Sanitized CKEditor HTML using DOMPurify
- Related pages
- Responsive footer navigation
- English/Arabic language switch
- Persistent language selection with `localStorage`
- Arabic RTL layout and localized dates
- English fallback when Arabic content is missing

## Tech Stack

- React
- Vite
- React Router
- Material UI
- MUI X Data Grid
- Axios
- React Toastify
- CKEditor 5
- Day.js
- DOMPurify
- dnd-kit for sortable menu interactions

## Requirements

- Node.js 18+ recommended
- npm
- Running Laravel backend

## Installation

```bash
git clone https://github.com/ihsansaleemkhan/cms-assignment.git
cd cms-assignment-frontend
npm install
```

Create a frontend environment file:

```bash
cp .env.example .env
```

Configure the backend API URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Start the development server:

```bash
npm run dev
```

Open the URL shown by Vite, commonly:

```text
http://localhost:5173
```

## Backend Prerequisites

Before using the frontend, start the Laravel backend:

```bash
php artisan serve
```

For uploaded cover images, ensure the storage link exists:

```bash
php artisan storage:link
```

Default backend URL:

```text
http://127.0.0.1:8000
```

## Seeded Login

| Role | Email | Password |
|---|---|---|
| System Administrator | `admin@cms.com` | `Password@123` |

Admin login URL:

```text
http://localhost:5173/admin/login
```

## Routes

### Public Routes

| Route | Description |
|---|---|
| `/` | Public homepage |
| `/menu/:slug` | Pages belonging to a menu or submenu |
| `/page/:slug` | Public page detail |
| `/not-found` | Public not-found screen |

### Admin Routes

| Route | Required permission |
|---|---|
| `/admin` | Redirects to login or dashboard |
| `/admin/login` | Public admin login |
| `/admin/dashboard` | `dashboard.view` |
| `/admin/menus` | `menu.view` |
| `/admin/pages` | `page.view` |
| `/admin/users` | `user.view` |
| `/admin/roles` | `role.view` |
| `/admin/audit-trash` | `page.trash.view` |
| `/admin/profile` | Authenticated user |
| `/admin/403` | Forbidden page |

## API Configuration

The Axios client should use:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Protected requests attach the Sanctum token:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/json
```

The frontend consumes both protected management APIs and public APIs:

```text
/api/public/menus
/api/public/pages
/api/public/pages/{slug}
```

## English and Arabic Support

The public website stores the selected language in:

```text
localStorage key: public_language
```

Supported language values:

```text
en
ar
```

Localization helpers select fields as follows:

```text
Arabic title: title_ar || title
Arabic body: body_ar || body
English title: title
English body: body
```

When Arabic is selected, the public layout updates:

- `document.documentElement.lang`
- `document.documentElement.dir`
- `document.body.dir`
- component direction and text alignment
- navigation placement
- arrow directions
- Arabic date formatting

## Main Source Structure

```text
src/
├── components/
│   ├── Common/
│   ├── Layout/
│   ├── Menus/
│   ├── Pages/
│   ├── AuditTrash/
│   └── Public/
│       ├── PublicHeader.jsx
│       ├── MobileNavigation.jsx
│       ├── HeroSection.jsx
│       ├── PageCard.jsx
│       ├── PublicFooter.jsx
│       └── LoadingPage.jsx
├── context/
│   └── LanguageContext.jsx
├── hooks/
├── layouts/
│   ├── AdminLayout.jsx
│   └── PublicLayout.jsx
├── pages/
│   ├── Auth/
│   ├── Dashboard/
│   ├── Menus/
│   ├── Pages/
│   ├── Roles/
│   ├── Users/
│   ├── AuditTrash/
│   └── Public/
│       ├── Home.jsx
│       ├── MenuPages.jsx
│       ├── PageDetail.jsx
│       └── PublicNotFound.jsx
├── routes/
│   └── AppRoutes.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── menuService.js
│   ├── pageService.js
│   └── publicService.js
└── utils/
    └── localization.js
```

## CKEditor

The page form uses the CKEditor Classic build for English and Arabic body content.

Current compatible dependency approach:

```json
{
  "@ckeditor/ckeditor5-build-classic": "^41.4.2",
  "@ckeditor/ckeditor5-react": "^6.3.0"
}
```

Do not mix the predefined Classic build with imports from the unified `ckeditor5` package, because that can cause duplicated CKEditor modules.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Build Verification

Before submission, run:

```bash
npm install
npm run lint
npm run build
```

Also test:

- Admin login and logout
- Role-based menu visibility
- CRUD operations
- Menu reordering
- Page image upload
- Arabic create/update fields
- Trash list, restore, and force delete
- Public menus and pages
- English/Arabic switch
- RTL desktop and mobile layouts
- Missing Arabic content fallback
- Public future-dated content visibility

## Security Notes

- Protected routes are a user-interface safeguard; the Laravel API remains the final authorization authority.
- Public CKEditor HTML is sanitized with DOMPurify before rendering.
- API tokens are attached only to protected management requests.
- Do not commit `.env`, generated build output, or `node_modules`.

## Troubleshooting

Clear Vite's optimized dependency cache:

```powershell
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
npm run dev -- --force
```

Reinstall dependencies when required:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Verify the backend URL and CORS configuration when API requests fail.

## Remaining Planned Work

- Final frontend regression testing
- Optional React Native mobile application
- Deployment configuration, if required

## Author

**Mohomed Ihsan Saleemkhan**  
Senior Software Engineer
