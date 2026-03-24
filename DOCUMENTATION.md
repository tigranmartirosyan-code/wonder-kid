# Wonder Kid - Full Project Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Getting Started](#4-getting-started)
5. [Environment Variables](#5-environment-variables)
6. [Database Schema & Entities](#6-database-schema--entities)
7. [Module Architecture](#7-module-architecture)
8. [API Endpoints](#8-api-endpoints)
9. [Authentication System](#9-authentication-system)
10. [Email Service](#10-email-service)
11. [Frontend (Views)](#11-frontend-views)
12. [Deployment](#12-deployment)
13. [Scripts & Commands](#13-scripts--commands)
14. [Testing](#14-testing)

---

## 1. Project Overview

Wonder Kid is a **NestJS-based educational management system** for managing students, trainers, courses, and class schedules. It provides a role-based admin panel (Admin, Trainer, Student) with JWT authentication, a server-rendered frontend using Handlebars, and automated AWS EC2 deployment.

**Live URL:** http://100.53.14.98

---

## 2. Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Runtime      | Node.js 20.x                        |
| Framework    | NestJS 11.0.1                        |
| Language     | TypeScript                           |
| Database     | PostgreSQL (via TypeORM)             |
| Auth         | JWT (jsonwebtoken) + HTTP-only cookies |
| Templates    | Handlebars (hbs)                     |
| Email        | Nodemailer (Gmail SMTP)              |
| Process Mgr  | PM2                                  |
| Web Server   | Nginx (reverse proxy)                |
| Cloud        | AWS EC2 (Ubuntu 22.04)              |

**Key Dependencies:**
- `@nestjs/core`, `@nestjs/common`, `@nestjs/typeorm`, `@nestjs/jwt`, `@nestjs/config`
- `typeorm`, `pg` (PostgreSQL driver)
- `passport-jwt`, `jsonwebtoken`
- `nodemailer`, `hbs`, `dayjs`, `class-validator`, `cookie-parser`

---

## 3. Directory Structure

```
wonder-kid/
├── src/
│   ├── main.ts                  # Application entry point (port 3000)
│   ├── app.module.ts            # Root module
│   ├── app.controller.ts        # Frontend routes (/, /login, /admin, /profile)
│   ├── app.service.ts           # Generic base service (CRUD)
│   ├── base.controller.ts       # Generic base controller (CRUD endpoints)
│   ├── db/
│   │   └── typeorm.ts           # TypeORM database configuration
│   ├── middleware/
│   │   └── auth.middleware.ts   # JWT auth middleware
│   ├── auth/                    # Authentication module
│   ├── users/                   # Admin users module
│   ├── students/                # Students module
│   ├── trainers/                # Trainers module
│   ├── courses/                 # Courses module
│   ├── schedules/               # Schedules module (calendar)
│   ├── blogs/                   # Blog posts module
│   ├── candidates/              # Enrollment candidates module
│   ├── seo/                     # SEO metadata module
│   ├── faq/                     # FAQ module
│   ├── pages/                   # Static pages/CMS module
│   └── email/                   # Email notification service
├── views/
│   ├── index.hbs                # Home page
│   ├── login.hbs                # Login page
│   ├── admin.hbs                # Admin dashboard
│   ├── profile.hbs              # Student profile
│   ├── partials/                # Reusable UI components
│   └── partials-index/          # Home page partials
├── public/                      # Static assets (CSS, JS, images, SVG)
├── test/                        # E2E tests
├── deploy.sh                    # AWS EC2 deployment script
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .prettierrc
```

Each feature module follows the same structure:
```
module-name/
├── module-name.controller.ts
├── module-name.service.ts
├── module-name.module.ts
├── dto/
│   ├── create-module-name.dto.ts
│   └── update-module-name.dto.ts
└── entities/
    └── module-name.entity.ts
```

---

## 4. Getting Started

### Prerequisites

- Node.js 20.x
- PostgreSQL
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/tigranmartirosyan-code/wonder-kid.git
cd wonder-kid

# Install dependencies
npm install

# Create PostgreSQL database
createdb test

# Create .env file (see Environment Variables section)

# Run in development mode
npm run dev
```

The application starts at **http://localhost:3000**.

---

## 5. Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=test
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=your-jwt-secret-here
```

| Variable          | Default     | Description                    |
|-------------------|-------------|--------------------------------|
| DATABASE_HOST     | 127.0.0.1   | PostgreSQL host                |
| DATABASE_PORT     | 5432        | PostgreSQL port                |
| DATABASE_NAME     | test        | Database name                  |
| DATABASE_USER     | postgres    | Database username              |
| DATABASE_PASSWORD | postgres    | Database password              |
| JWT_SECRET        | mysecret    | Secret key for JWT signing     |

---

## 6. Database Schema & Entities

TypeORM with `synchronize: true` auto-creates tables from entities.

### Users (Admin accounts)

| Column    | Type   | Constraints        |
|-----------|--------|--------------------|
| id        | UUID   | Primary Key        |
| fullName  | string | required           |
| email     | string | unique, required   |
| phone     | string | unique, required   |
| password  | string | required           |
| role      | string | e.g. 'admin'       |
| work_type | string |                    |

### Students

| Column    | Type   | Constraints          |
|-----------|--------|----------------------|
| id        | UUID   | Primary Key          |
| fullName  | string | required             |
| email     | string | unique, required     |
| password  | string | optional             |
| image     | text   | optional             |
| age       | number | required             |
| groupName | string | required             |
| phones    | string | required             |
| schedules | M2M    | → Schedule (eager)   |

### Trainers

| Column      | Type   | Constraints          |
|-------------|--------|----------------------|
| id          | UUID   | Primary Key          |
| fullName    | string | required             |
| role        | string | required             |
| email       | string | unique, optional     |
| password    | string | optional             |
| phone       | string | optional             |
| description | text   | optional             |
| image       | text   | optional             |
| schedules   | M2M    | → Schedule (eager)   |

### Courses

| Column   | Type    | Constraints  |
|----------|---------|--------------|
| id       | UUID    | Primary Key  |
| title    | string  | required     |
| duration | string  | required     |
| price    | decimal | required     |
| image    | string  | required     |

### Schedules

| Column    | Type        | Constraints                    |
|-----------|-------------|--------------------------------|
| id        | UUID        | Primary Key                    |
| title     | string      | required                       |
| startDate | timestamptz | required                       |
| endDate   | timestamptz | required                       |
| color     | varchar(20) | required (hex color)           |
| students  | M2M         | → Student (join: schedule_students)  |
| trainers  | M2M         | → Trainer (join: schedule_trainers)  |

### Blogs

| Column        | Type         | Constraints  |
|---------------|--------------|--------------|
| id            | UUID         | Primary Key  |
| title         | varchar(255) | required     |
| description   | text         | required     |
| image         | varchar(500) | required     |
| category      | varchar(100) | required     |
| date          | timestamp    | required     |
| categoryColor | varchar(100) | required     |
| categoryLabel | varchar(100) | required     |

### Candidates (enrollment applicants)

| Column   | Type   | Constraints  |
|----------|--------|--------------|
| id       | UUID   | Primary Key  |
| fullName | string | required     |
| email    | string | optional     |
| age      | number | optional     |
| gender   | string | optional     |
| phones   | string | required     |

### SEO

| Column          | Type         | Constraints  |
|-----------------|--------------|--------------|
| id              | UUID         | Primary Key  |
| pageName        | varchar(255) | required, unique |
| metaTitle       | varchar(255) | required     |
| metaDescription | text         | required     |
| metaKeywords    | text         | optional     |
| ogImage         | varchar(500) | optional     |
| canonicalUrl    | varchar(500) | optional     |

### FAQ

| Column    | Type         | Constraints     |
|-----------|--------------|-----------------|
| id        | UUID         | Primary Key     |
| question  | text         | required        |
| answer    | text         | required        |
| category  | varchar(100) | optional        |
| sortOrder | int          | default: 0      |

### Pages (CMS)

| Column  | Type         | Constraints         |
|---------|--------------|---------------------|
| id      | UUID         | Primary Key         |
| title   | varchar(255) | required            |
| slug    | varchar(255) | unique, required    |
| content | text         | required            |
| status  | varchar(20)  | default: 'draft'   |

### Entity Relationships

```
Students ←——M2M——→ Schedules (join table: schedule_students)
Trainers ←——M2M——→ Schedules (join table: schedule_trainers)
```

---

## 7. Module Architecture

### Inheritance Pattern

The project uses a generic CRUD pattern with inheritance:

**AppService (Base Service)** — provides `create()`, `findAll()`, `findOne()`, `update()`, `remove()` for any entity.

**BaseController (Base Controller)** — provides `POST /`, `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id` endpoints.

All feature services extend `AppService` and all feature controllers extend `BaseController`, getting full CRUD out of the box. Custom methods are added per module as needed.

### Module List

| Module     | Description                              | Custom Methods                          |
|------------|------------------------------------------|-----------------------------------------|
| Auth       | Login, register, logout                  | login, register, logout                 |
| Users      | Admin user management                    | Standard CRUD                           |
| Students   | Student profiles                         | findByEmail, findByGroupName            |
| Trainers   | Trainer profiles                         | findByEmail                             |
| Courses    | Course catalog                           | Standard CRUD                           |
| Schedules  | Class schedules with student/trainer M2M | Custom create/update with relation IDs  |
| Blogs      | Blog posts                               | Standard CRUD                           |
| Candidates | Enrollment applicants                    | register (custom endpoint)              |
| SEO        | Page metadata                            | findByPageName                          |
| FAQ        | Frequently asked questions               | Standard CRUD                           |
| Pages      | Static pages (CMS)                       | Standard CRUD                           |
| Email      | Email notifications                      | send                                    |

---

## 8. API Endpoints

### Authentication

| Method | Endpoint         | Description                | Body                                           |
|--------|------------------|----------------------------|-------------------------------------------------|
| POST   | /auth/login      | Login (returns JWT cookie) | `{ email, password }`                          |
| POST   | /auth/register   | Register new user          | `{ fullName, email, phone, password, role }`   |
| POST   | /auth/logout     | Logout (clears cookie)     | —                                              |

### Users (Admin)

| Method | Endpoint    | Description       |
|--------|-------------|-------------------|
| GET    | /users      | List all users    |
| GET    | /users/:id  | Get user by ID    |
| POST   | /users      | Create user       |
| PATCH  | /users/:id  | Update user       |
| DELETE | /users/:id  | Delete user       |

### Students

| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| GET    | /students       | List all students    |
| GET    | /students/:id   | Get student by ID    |
| POST   | /students       | Create student       |
| PATCH  | /students/:id   | Update student       |
| DELETE | /students/:id   | Delete student       |

### Trainers

| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| GET    | /trainers       | List all trainers    |
| GET    | /trainers/:id   | Get trainer by ID    |
| POST   | /trainers       | Create trainer       |
| PATCH  | /trainers/:id   | Update trainer       |
| DELETE | /trainers/:id   | Delete trainer       |

### Courses

| Method | Endpoint       | Description         |
|--------|----------------|---------------------|
| GET    | /courses       | List all courses    |
| GET    | /courses/:id   | Get course by ID    |
| POST   | /courses       | Create course       |
| PATCH  | /courses/:id   | Update course       |
| DELETE | /courses/:id   | Delete course       |

### Schedules

| Method | Endpoint         | Description                                        |
|--------|------------------|----------------------------------------------------|
| GET    | /schedules       | List all schedules (with students & trainers)      |
| GET    | /schedules/:id   | Get schedule by ID                                 |
| POST   | /schedules       | Create schedule `{ ..., studentIds[], trainerIds[] }` |
| PATCH  | /schedules/:id   | Update schedule                                    |
| DELETE | /schedules/:id   | Delete schedule                                    |

### Blogs

| Method | Endpoint     | Description        |
|--------|--------------|--------------------|
| GET    | /blogs       | List all blogs     |
| GET    | /blogs/:id   | Get blog by ID     |
| POST   | /blogs       | Create blog        |
| PATCH  | /blogs/:id   | Update blog        |
| DELETE | /blogs/:id   | Delete blog        |

### Candidates

| Method | Endpoint               | Description                  |
|--------|------------------------|------------------------------|
| GET    | /candidates            | List all candidates          |
| GET    | /candidates/:id        | Get candidate by ID          |
| POST   | /candidates            | Create candidate             |
| POST   | /candidates/register   | Register candidate (redirect)|
| PATCH  | /candidates/:id        | Update candidate             |
| DELETE | /candidates/:id        | Delete candidate             |

### SEO

| Method | Endpoint   | Description       |
|--------|------------|-------------------|
| GET    | /seo       | List all SEO      |
| GET    | /seo/:id   | Get SEO by ID     |
| POST   | /seo       | Create SEO entry  |
| PATCH  | /seo/:id   | Update SEO        |
| DELETE | /seo/:id   | Delete SEO        |

### FAQ

| Method | Endpoint   | Description      |
|--------|------------|------------------|
| GET    | /faq       | List all FAQs    |
| GET    | /faq/:id   | Get FAQ by ID    |
| POST   | /faq       | Create FAQ       |
| PATCH  | /faq/:id   | Update FAQ       |
| DELETE | /faq/:id   | Delete FAQ       |

### Pages

| Method | Endpoint     | Description        |
|--------|--------------|--------------------|
| GET    | /pages       | List all pages     |
| GET    | /pages/:id   | Get page by ID     |
| POST   | /pages       | Create page        |
| PATCH  | /pages/:id   | Update page        |
| DELETE | /pages/:id   | Delete page        |

### Email

| Method | Endpoint     | Description                     |
|--------|--------------|---------------------------------|
| POST   | /email/send  | Send contact form email         |

**Body:** `{ subject, username, email, phone, message }`

### Frontend (Server-Rendered)

| Method | Endpoint  | Description                      |
|--------|-----------|----------------------------------|
| GET    | /         | Home page                        |
| GET    | /login    | Login page                       |
| GET    | /admin    | Admin dashboard (auth required)  |
| GET    | /profile  | Student profile (auth required)  |

---

## 9. Authentication System

### Flow

1. User sends `POST /auth/login` with `{ email, password }`
2. System checks credentials against Users → Trainers → Students tables (in that order)
3. On match, a JWT is signed:
   ```
   payload: { username, role, userId|trainerId|studentId }
   secret: JWT_SECRET
   expiry: 1 hour
   ```
4. JWT is set as an HTTP-only cookie (`auth_token`)
5. Client receives `{ success: true, role, message }`

### Middleware Protection

The `AuthMiddleware` protects `/admin` and `/profile` routes:
- Reads `auth_token` from cookies
- Verifies JWT signature
- Attaches decoded user to `req.user`
- Redirects to `/login` if token is missing or invalid

### Roles

| Role    | Access                                                  |
|---------|---------------------------------------------------------|
| admin   | Full access — manage all entities via admin dashboard   |
| trainer | View schedules, courses, and assigned students          |
| student | View own profile, group members, and schedules          |

### Registration

`POST /auth/register` accepts `{ fullName, email, phone, password, role }`:
- Validates Armenian phone number format
- Creates record in the appropriate table based on `role`

---

## 10. Email Service

**SMTP:** Gmail (smtp.gmail.com:587)

The email module uses Nodemailer with a Handlebars HTML template.

**Endpoint:** `POST /email/send`

**Payload:**
```json
{
  "subject": "Contact form subject",
  "username": "John Doe",
  "email": "john@example.com",
  "phone": "+37491234567",
  "message": "Hello, I want to enroll..."
}
```

The email is sent to the configured admin email and the user is redirected to `/`.

---

## 11. Frontend (Views)

The frontend uses **Handlebars** server-side rendering.

### Pages

| Template     | Route    | Description                              |
|--------------|----------|------------------------------------------|
| index.hbs    | /        | Public home page (courses, trainers, blogs) |
| login.hbs    | /login   | Login form                               |
| admin.hbs    | /admin   | Admin dashboard (role-based panels)      |
| profile.hbs  | /profile | Student profile with group members       |

### Partials (`/views/partials/`)

| Partial          | Description                    |
|------------------|--------------------------------|
| aside.hbs        | Sidebar navigation             |
| dashboard.hbs    | Dashboard overview widget      |
| student.hbs      | Student management table       |
| trainer.hbs      | Trainer management table       |
| course.hbs       | Course management table        |
| schedule.hbs     | Schedule calendar component    |
| blog.hbs         | Blog management                |
| seo.hbs          | SEO metadata editor            |
| faq.hbs          | FAQ list editor                |
| pages.hbs        | CMS pages editor               |
| candidate.hbs    | Candidates management          |
| analistic.hbs    | Analytics dashboard            |
| callendar.hbs    | Calendar component             |
| mobilemenu.hbs   | Mobile navigation menu         |

### Template Helpers

- **formatDate** — formats dates using dayjs: `{{formatDate date "YYYY-MM-DD"}}`

---

## 12. Deployment

### Infrastructure

| Component    | Configuration                    |
|--------------|----------------------------------|
| Cloud        | AWS EC2                          |
| OS           | Ubuntu 22.04                     |
| Instance     | t2.micro                         |
| Region       | us-east-1                        |
| Web Server   | Nginx (reverse proxy port 80 → 3000) |
| Process Mgr  | PM2 (auto-restart, systemd)      |
| Database     | PostgreSQL on EC2                |

### Open Ports

| Port | Service    |
|------|------------|
| 22   | SSH        |
| 80   | HTTP       |
| 443  | HTTPS      |
| 3000 | NestJS     |
| 5432 | PostgreSQL |

### Deploy Command

```bash
chmod +x deploy.sh
./deploy.sh
```

The script performs these steps:
1. Configures AWS CLI credentials
2. Creates EC2 key pair
3. Creates security group and opens ports
4. Launches EC2 instance (Ubuntu 22.04)
5. Waits for SSH access
6. Dumps local PostgreSQL database
7. Copies dump to EC2 and restores it
8. Installs PostgreSQL, Node.js 20, PM2, Nginx on EC2
9. Configures Nginx reverse proxy
10. Syncs project files via rsync
11. Creates `.env`, installs dependencies, builds, starts with PM2

### Post-Deployment

```
App URL:  http://<EC2_IP>
SSH:      ssh -i wonder-kid-key.pem ubuntu@<EC2_IP>
Database: psql -h <EC2_IP> -U postgres -d test
```

---

## 13. Scripts & Commands

| Command               | Description                           |
|-----------------------|---------------------------------------|
| `npm run dev`         | Development mode with nodemon         |
| `npm run start:dev`   | Development with NestJS watch         |
| `npm run build`       | Compile TypeScript                    |
| `npm run start`       | Start application                     |
| `npm run start:prod`  | Production mode (runs dist/main.js)   |
| `npm run start:debug` | Debug mode with inspector             |
| `npm run lint`        | Run ESLint with auto-fix              |
| `npm run format`      | Format code with Prettier             |
| `npm test`            | Run unit tests (Jest)                 |
| `npm run test:watch`  | Watch mode for tests                  |
| `npm run test:cov`    | Test coverage report                  |
| `npm run test:e2e`    | Run E2E tests                         |

---

## 14. Testing

**Framework:** Jest + Supertest

**Unit tests:** `src/**/*.spec.ts`
**E2E tests:** `test/*.e2e-spec.ts`

```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run E2E
npm run test:e2e
```

---

## License

UNLICENSED (Private)
