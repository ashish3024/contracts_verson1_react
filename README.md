# Contracts Backend

Spring Boot REST API for the Contracts Management System.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Language    | Java 17                           |
| Framework   | Spring Boot 3.2                   |
| Persistence | Spring Data JPA + Hibernate       |
| Database    | PostgreSQL 14+ (H2 for tests)     |
| Build       | Maven                             |

---

## Project Structure

```
src/
├── main/java/com/seventhray/contracts/
│   ├── ContractsApplication.java     ← entry point
│   ├── config/
│   │   ├── WebConfig.java            ← CORS settings
│   │   └── DataInitializer.java      ← dev seed (active on 'dev' profile)
│   ├── controller/
│   │   └── ContractController.java   ← REST endpoints
│   ├── dto/
│   │   ├── ContractDto.java
│   │   ├── WorkflowHistoryDto.java
│   │   └── ApiError.java
│   ├── exception/
│   │   ├── ContractNotFoundException.java
│   │   └── GlobalExceptionHandler.java
│   ├── model/
│   │   ├── Contract.java
│   │   ├── ContractStatus.java       ← DRAFT | REVIEW | APPROVED | REJECTED | EXPIRED
│   │   └── WorkflowHistory.java
│   ├── repository/
│   │   ├── ContractRepository.java
│   │   └── WorkflowHistoryRepository.java
│   └── service/
│       └── ContractService.java
├── main/resources/
│   ├── application.properties        ← production defaults
│   └── application-dev.properties    ← dev overrides (ddl-auto=update, SQL logging)
└── test/
    ├── java/com/seventhray/contracts/
    │   ├── controller/ContractControllerIntegrationTest.java
    │   └── service/ContractServiceTest.java
    └── resources/application-test.properties  ← H2 in-memory
database/
├── schema.sql   ← manual DDL for production setup
└── seed.sql     ← sample data
```

---

## Prerequisites

- Java 17+
- Maven 3.9+
- PostgreSQL 14+ running locally

---

## Database Setup

```sql
-- Run once in psql or pgAdmin
CREATE DATABASE contracts_db;
```

Then apply the schema:

```bash
psql -U postgres -d contracts_db -f database/schema.sql
# Optional: load sample data
psql -U postgres -d contracts_db -f database/seed.sql
```

Or let Spring handle schema creation in dev mode (see below).

---

## Running the Application

### Development mode (auto-creates schema + seeds data)

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The `dev` profile sets `ddl-auto=update`, enables SQL logging, and runs
`DataInitializer` to seed 10 sample contracts with workflow history on first
startup.

### Production mode

```bash
mvn clean package -DskipTests
java -jar target/contracts-1.0.0.jar
```

Update `src/main/resources/application.properties` with your DB credentials
before packaging, or pass them as environment variables:

```bash
java -jar target/contracts-1.0.0.jar \
  --spring.datasource.url=jdbc:postgresql://host:5432/contracts_db \
  --spring.datasource.username=myuser \
  --spring.datasource.password=mypassword
```

---

## Running Tests

```bash
mvn test
```

Tests run against an H2 in-memory database using the `test` profile — no
PostgreSQL needed.

---

## API Reference

Base URL: `http://localhost:8080/api`

### List contracts

```
GET /api/contracts
```

| Query param | Type   | Default | Description                                      |
|-------------|--------|---------|--------------------------------------------------|
| `search`    | string | —       | Free-text filter on title or owner name          |
| `status`    | enum   | —       | `DRAFT` `REVIEW` `APPROVED` `REJECTED` `EXPIRED` |
| `page`      | int    | `0`     | Zero-based page number                           |
| `size`      | int    | `10`    | Page size (1–100)                                |

**Response** `200 OK` – Spring `Page<ContractDto>`:

```json
{
  "content": [
    {
      "id": "a1b2c3d4-...",
      "title": "Vendor Supply Agreement",
      "description": "...",
      "status": "APPROVED",
      "owner_name": "Alice Johnson",
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-03-01T10:00:00Z"
    }
  ],
  "totalElements": 42,
  "totalPages": 5,
  "number": 0,
  "size": 10
}
```

---

### Get contract

```
GET /api/contracts/{id}
```

**Response** `200 OK` – `ContractDto` | `404 Not Found`

---

### Get workflow history

```
GET /api/contracts/{id}/history
```

**Response** `200 OK` – array of `WorkflowHistoryDto`, most recent first:

```json
[
  {
    "id": "...",
    "contract_id": "...",
    "previous_status": "REVIEW",
    "new_status": "APPROVED",
    "changed_by": "Admin User",
    "changed_at": "2024-03-01T10:00:00Z"
  }
]
```

`previous_status` is `null` for the first entry (contract creation).

---

## CORS

CORS is pre-configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternative dev server)

Edit `WebConfig.java` to add your production frontend origin.

---

## Connecting the Frontend

The frontend calls `/api/*` which the Vite dev server proxies to
`http://localhost:8080`. No change needed on the frontend side — just ensure
the backend is running on port `8080` before starting the frontend.
