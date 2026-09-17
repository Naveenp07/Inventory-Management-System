# IT Helpdesk Management System

A centralized internal IT Helpdesk / Ticket Management System built as a learning project: a real ASP.NET Core Web API backend with SQL Server, backed by role-based authentication, and a vanilla HTML/CSS/JS frontend.

> **Status:** All 10 backend phases are complete and tested. The frontend (Phase 11) is in progress — login, dashboards, and the full ticket workflow (create/list/detail/comments/attachments/assign/status/priority) are built and working. Assets, Reports, Knowledge Base, and Admin panel pages are still to come.

## Features

- **Authentication & Roles** — JWT-based auth via ASP.NET Core Identity, with three roles: Employee, IT Support Engineer, Administrator.
- **Ticket Management** — full CRUD, auto-generated ticket numbers (`TK-2026-000001`), assignment, enforced status-transition rules, priority changes, comments (with staff-only internal notes), a full audit history timeline, and file attachments stored on disk.
- **Asset Management** — tracks laptops, desktops, printers, etc. with assignment to users.
- **Dashboards & Reports** — role-specific dashboards (Employee / Engineer / Admin) with live aggregated stats, plus a filterable reports module with CSV export.
- **Knowledge Base** — staff-authored help articles employees can search.
- **Notifications** — in-app notifications triggered automatically by ticket actions (assigned, status changed, commented on).
- **Admin Panel** — user management (create/disable/reset password/change role), department & category management, and a full audit log of administrative actions.
- **Security** — every "who can see this" and "who can do this" rule is enforced server-side from JWT claims, never trusted from the frontend. Employees can never see another employee's tickets or staff-only internal notes, even by inspecting network traffic.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core Web API (.NET 8), C# |
| ORM | Entity Framework Core (Code First) |
| Database | Microsoft SQL Server |
| Auth | ASP.NET Core Identity + JWT Bearer tokens |
| Frontend | HTML5, CSS3, vanilla JavaScript (no frameworks) |
| API Docs | Swagger / OpenAPI |

## Architecture

The backend follows a layered structure:

```
ITHelpdesk.API/
├── Controllers/     — HTTP endpoints; decide what to call, no business logic
├── Models/          — EF Core entities = SQL tables
├── DTOs/            — shapes of data actually sent over the API (never expose entities directly)
├── Data/             — ApplicationDbContext, the bridge to SQL Server
├── Services/        — business logic (JWT generation, file storage, notifications, audit logging)
├── Helpers/          — small reusable utilities (ticket number generation, status-transition rules)
├── Extensions/       — startup seeding logic
└── Program.cs        — app startup: registers services, configures the request pipeline

ITHelpdesk.Web/
├── login.html, dashboard.html, tickets.html, create-ticket.html, ticket-details.html, ...
├── css/style.css      — full design system (colors, dark mode, components)
└── js/
    ├── api.js         — JWT-aware fetch wrapper used by every page
    ├── common.js       — app shell: sidebar, topbar, dark mode, notifications
    ├── auth.js         — login page logic
    ├── tickets.js       — shared ticket rendering helpers
    └── ticket-details.js — ticket detail page logic
```

**Key security principle:** every authenticated request carries a JWT. Controllers read the caller's identity (user ID, role) from that token's claims — never from anything the frontend sends in the request body or URL. This is what makes it impossible for one employee to see another's tickets, or for a self-registered account to grant itself admin rights, no matter what the client sends.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- SQL Server (Express, Developer, or Standard) + SQL Server Management Studio (SSMS)
- A way to serve static files for the frontend (e.g. `dotnet tool install --global dotnet-serve`, or VS Code's Live Server extension)
- A modern browser (Chrome/Edge)

## Setup

### 1. Database

Open `ITHelpdesk.API/appsettings.Development.json` and set your connection string. Examples:

```json
// Windows Authentication, default instance
"DefaultConnection": "Server=localhost;Database=ITHelpdeskDB;Trusted_Connection=True;TrustServerCertificate=True;"

// SQL Server Express, named instance
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=ITHelpdeskDB;Trusted_Connection=True;TrustServerCertificate=True;"

// SQL Server Authentication
"DefaultConnection": "Server=localhost;Database=ITHelpdeskDB;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True;Encrypt=True;"
```

Also set a random `Jwt:Key` value (any long random string) in the same file — this signs authentication tokens and must never be committed with a real production value.

### 2. Backend

```bash
cd ITHelpdesk/ITHelpdesk.API
dotnet restore
dotnet build

# One-time: install the EF Core CLI tool
dotnet tool install --global dotnet-ef

# Create and apply the database schema
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run the API
dotnet run
```

The API starts on `https://localhost:7099` (and `http://localhost:5099`). Swagger UI is available at `https://localhost:7099/swagger` — use it to explore and test every endpoint directly, including logging in and authorizing requests with a JWT.

On first run, the app automatically seeds:
- The three roles (Administrator, ITSupport, Employee)
- A default admin account
- Sample departments, categories, and assets

**Default admin login (development only — never use in production):**
```
Email:    admin@ithelpdesk.local
Password: Admin@12345
```

### 3. Frontend

```bash
# One-time
dotnet tool install --global dotnet-serve

cd ITHelpdesk/ITHelpdesk.Web
dotnet-serve --port 5500
```

Open `http://localhost:5500/login.html`. The frontend calls the API directly at `https://localhost:7099/api`, so **the backend must be running at the same time**, in a separate terminal.

> The API's CORS policy (in `Program.cs`) only allows requests from `http://localhost:5500`, `http://127.0.0.1:5500`, and `http://localhost:3000`. If you serve the frontend from a different port, add it to the `WithOrigins(...)` list in `Program.cs`.

## Configuration

All sensitive configuration lives in `appsettings.Development.json` for local development (git-ignored in spirit — replace with real secrets management, e.g. User Secrets or environment variables, before any real deployment):

| Key | Purpose |
|---|---|
| `ConnectionStrings:DefaultConnection` | SQL Server connection string |
| `Jwt:Key` | Symmetric key used to sign JWTs |
| `Jwt:Issuer` / `Jwt:Audience` | JWT validation values |
| `FileStorage:BasePath` | Where uploaded ticket attachments are stored on disk |
| `Smtp:*` | Reserved for future email notification integration (not yet implemented) |

## API overview

Full interactive documentation is in Swagger, but broadly:

- `POST /api/auth/register`, `/login`, `/me`, `/logout`
- `GET/POST/PUT/DELETE /api/tickets`, plus `/assign`, `/status`, `/priority`, `/resolve`, `/close`, `/reopen`, `/comments`, `/history`, `/attachments`
- `GET/POST/PUT/DELETE /api/assets`, plus `/assign`
- `GET /api/dashboard/employee`, `/engineer`, `/admin`
- `GET /api/reports/tickets` (with `?format=csv`), `/categories`, `/engineers`, `/sla`
- `GET/POST/PUT /api/knowledgebase`
- `GET/PUT /api/notifications`
- `GET/POST/PUT /api/users` (Admin), `/departments`, `/categories`, `/auditlogs`

## Folder structure

```
ITHelpdesk/
├── ITHelpdesk.sln
├── README.md
├── .gitignore
├── ITHelpdesk.API/      — backend
└── ITHelpdesk.Web/      — frontend
```

## Troubleshooting

- **"ASP.NET Core developer certificate is not trusted"** — run `dotnet dev-certs https --clean` then `dotnet dev-certs https --trust`.
- **`ERR_CONNECTION_CLOSED` on Swagger** — same cause as above; the HTTPS dev cert isn't trusted yet.
- **401 with "JWT is not well formed"** — you likely copied the token including its surrounding quote marks from a JSON response. Copy only the raw token string.
- **"Unable to resolve service for type ..."** — a service interface is used in a controller but never registered in `Program.cs`. Check every `AddScoped<IXxx, Xxx>()` line is present.
- **"Failed to fetch" on login** — the frontend is being served from a port not in the API's CORS allow-list. Confirm the browser URL matches `localhost:5500` (or whichever port you added to `Program.cs`).
- **404 on a lookup/action endpoint nested under a controller with its own route prefix** — check the route attribute starts with `~/` if it's meant to be an absolute path independent of the controller's prefix.

## Roadmap

- [x] Phase 1 — Architecture & project scaffold
- [x] Phase 2 — Database & EF Core models
- [x] Phase 3 — Authentication, JWT, roles
- [x] Phase 4 — Ticket CRUD
- [x] Phase 5 — Assignment, status, priority
- [x] Phase 6 — Comments, history, attachments
- [x] Phase 7 — Asset management
- [x] Phase 8 — Dashboards, reports, charts (API)
- [x] Phase 9 — Knowledge base, notifications
- [x] Phase 10 — Admin panel
- [ ] Phase 11 — Frontend (login/dashboard/tickets done; assets/reports/KB/admin pages pending)
- [ ] Phase 12 — Testing, debugging, final polish

## Future improvements

- Email notifications (SMTP config is already reserved in `appsettings.json`)
- Microsoft Entra ID / Active Directory integration
- SLA due-date calculation and enforcement
- AI-assisted ticket classification
- Mobile app / PWA support

## License

Internal / educational project. No license specified.
