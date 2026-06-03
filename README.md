# Hardware Inventory Management System

Full-stack inventory system — Spring Boot 3.2 backend + React/Vite frontend.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java JDK | 17+ |
| Maven | 3.9+ (or use included `mvnw`) |
| Node.js | 18+ |
| SQL Server | 2019 |
| IntelliJ IDEA | 2022+ (Community or Ultimate) |

---

## Step 1 — Database Setup

1. Open **SQL Server Management Studio (SSMS)**
2. Run `database/schema.sql` — creates the database and all tables
3. Run `database/sample-data.sql` — inserts sample devices, vendors, users

---

## Step 2 — Backend (IntelliJ)

1. Open IntelliJ IDEA
2. **File → Open** → select the `backend/` folder
3. IntelliJ will detect it as a Maven project — click **"Load Maven Project"** if prompted
4. Wait for dependencies to download (first time takes a few minutes)
5. Open `src/main/resources/application.properties`
6. Update your SQL Server credentials:
   ```
   spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=HardwareInventoryDB;encrypt=false;trustServerCertificate=true
   spring.datasource.username=sa
   spring.datasource.password=YOUR_PASSWORD_HERE
   ```
7. Run `HardwareInventoryApplication.java` (right-click → Run)
8. Backend starts at **http://localhost:8080**

### Default Login Users (auto-created on first run)
| Username | Password   | Role    |
|----------|------------|---------|
| admin    | admin@123  | ADMIN   |
| manager  | manager@123| MANAGER |
| viewer   | viewer@123 | VIEWER  |

---

## Step 3 — Frontend

Open a terminal in the `frontend/` folder:

```bash
npm install
npm run dev
```

Frontend starts at **http://localhost:5173**

---

## API Documentation (Swagger)

Once the backend is running, visit:
**http://localhost:8080/swagger-ui/index.html**

---

## Project Structure

```
hardware-inventory-system/
├── backend/                  ← Spring Boot (open THIS in IntelliJ)
│   ├── src/main/java/com/inventory/
│   │   ├── controller/       ← REST endpoints
│   │   ├── service/          ← Business logic
│   │   ├── repository/       ← JPA repositories
│   │   ├── entity/           ← JPA entities
│   │   ├── dto/              ← Data transfer objects
│   │   ├── security/         ← JWT auth filter, service
│   │   ├── config/           ← Security, CORS, app config
│   │   └── exception/        ← Global error handling
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                 ← React + Vite
│   ├── src/
│   └── package.json
│
└── database/
    ├── schema.sql            ← Run first
    └── sample-data.sql       ← Run second
```

---

## Troubleshooting

**"Cannot connect to SQL Server"**
- Make sure SQL Server service is running
- Check your `application.properties` password
- Make sure TCP/IP is enabled in SQL Server Configuration Manager

**"Port 8080 already in use"**
- Change `server.port=8081` in `application.properties`

**Maven dependencies not downloading**
- File → Invalidate Caches → Restart
- Right-click `pom.xml` → Maven → Reload Project
