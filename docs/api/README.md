# VRIKSHAM API Documentation

## Base URL

| Environment | URL                                    |
|-------------|----------------------------------------|
| Development | `http://localhost:4000/api/v1`          |
| Staging     | `https://api-staging.vriksham.com/api/v1` |
| Production  | `https://api.vriksham.com/api/v1`      |

## Authentication

All protected endpoints require a JWT Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained via the login or Google OAuth endpoints and expire after 7 days by default. Use the refresh endpoint to obtain new tokens.

### Roles

| Role         | Description                        |
|--------------|------------------------------------|
| `ADMIN`      | Full access to all resources       |
| `CLIENT`     | Access to own data and plants      |
| `TECHNICIAN` | Access to assigned visits and logs |

---

## Health Check

### `GET /health`

Returns server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-15T10:00:00.000Z",
  "uptime": 86400
}
```

**Example:**
```bash
curl http://localhost:4000/api/v1/health
```

---

## Auth Endpoints

### `POST /auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "Suman Kumar",
  "email": "suman@example.com",
  "password": "SecurePass123!",
  "phone": "+919876543210"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Suman Kumar",
      "email": "suman@example.com",
      "role": "CLIENT",
      "avatar": null,
      "createdAt": "2026-03-15T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Suman Kumar","email":"suman@example.com","password":"SecurePass123!","phone":"+919876543210"}'
```

---

### `POST /auth/login`

Authenticate with email and password.

**Request Body:**
```json
{
  "email": "suman@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Suman Kumar",
      "email": "suman@example.com",
      "role": "CLIENT",
      "avatar": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"suman@example.com","password":"SecurePass123!"}'
```

---

### `POST /auth/refresh`

Refresh an expired access token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIs..."}'
```

---

### `POST /auth/google`

Authenticate or register via Google OAuth.

**Request Body:**
```json
{
  "googleId": "google-account-id",
  "email": "user@gmail.com",
  "name": "User Name",
  "avatar": "https://lh3.googleusercontent.com/...",
  "accessToken": "google-oauth-access-token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "User Name",
      "email": "user@gmail.com",
      "role": "CLIENT",
      "avatar": "https://lh3.googleusercontent.com/..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/google \
  -H "Content-Type: application/json" \
  -d '{"googleId":"12345","email":"user@gmail.com","name":"User Name","avatar":"https://...","accessToken":"ya29..."}'
```

---

### `POST /auth/logout`

Invalidate the current session. **Requires authentication.**

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/logout \
  -H "Authorization: Bearer <token>"
```

---

## Users Endpoints

### `GET /users/me`

Get the current authenticated user profile. **Requires authentication.**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Suman Kumar",
    "email": "suman@example.com",
    "role": "CLIENT",
    "avatar": null,
    "phone": "+919876543210",
    "isActive": true,
    "lastLogin": "2026-03-15T10:00:00.000Z",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Example:**
```bash
curl http://localhost:4000/api/v1/users/me \
  -H "Authorization: Bearer <token>"
```

---

### `PUT /users/me`

Update current user profile. **Requires authentication.**

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+919876543211",
  "avatar": "https://cdn.vriksham.com/avatars/user.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Name",
    "email": "suman@example.com",
    "phone": "+919876543211",
    "avatar": "https://cdn.vriksham.com/avatars/user.jpg"
  }
}
```

**Example:**
```bash
curl -X PUT http://localhost:4000/api/v1/users/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","phone":"+919876543211"}'
```

---

### `GET /users` (Admin)

List all users with pagination. **Requires ADMIN role.**

**Query Parameters:**

| Param    | Type   | Default | Description               |
|----------|--------|---------|---------------------------|
| `page`   | number | 1       | Page number               |
| `limit`  | number | 20      | Items per page            |
| `role`   | string | -       | Filter by role            |
| `search` | string | -       | Search by name or email   |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

**Example:**
```bash
curl "http://localhost:4000/api/v1/users?page=1&limit=10&role=CLIENT" \
  -H "Authorization: Bearer <admin-token>"
```

---

### `GET /users/:id` (Admin)

Get a user by ID. **Requires ADMIN role.**

**Example:**
```bash
curl http://localhost:4000/api/v1/users/uuid-here \
  -H "Authorization: Bearer <admin-token>"
```

---

### `PUT /users/:id` (Admin)

Update a user by ID. **Requires ADMIN role.**

**Example:**
```bash
curl -X PUT http://localhost:4000/api/v1/users/uuid-here \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"role":"TECHNICIAN","isActive":true}'
```

---

### `DELETE /users/:id` (Admin)

Soft-delete a user. **Requires ADMIN role.**

**Example:**
```bash
curl -X DELETE http://localhost:4000/api/v1/users/uuid-here \
  -H "Authorization: Bearer <admin-token>"
```

---

## Clients Endpoints

### `GET /clients`

List all clients with pagination. **Requires ADMIN role.**

**Query Parameters:**

| Param    | Type   | Default | Description                           |
|----------|--------|---------|---------------------------------------|
| `page`   | number | 1       | Page number                           |
| `limit`  | number | 20      | Items per page                        |
| `status` | string | -       | Filter: ACTIVE, INACTIVE, SUSPENDED   |
| `type`   | string | -       | Filter: CORPORATE, RESIDENTIAL        |
| `city`   | string | -       | Filter by city                        |
| `search` | string | -       | Search by company name or contact     |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clients": [
      {
        "id": "uuid",
        "userId": "uuid",
        "companyName": "TechCorp India",
        "industry": "Technology",
        "type": "CORPORATE",
        "address": "123 MG Road",
        "city": "Bangalore",
        "state": "Karnataka",
        "status": "ACTIVE",
        "contactPerson": "Rahul Sharma",
        "contactPhone": "+919876543210",
        "user": { "name": "Rahul Sharma", "email": "rahul@techcorp.in" },
        "createdAt": "2026-01-15T00:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 12, "totalPages": 1 }
  }
}
```

**Example:**
```bash
curl "http://localhost:4000/api/v1/clients?status=ACTIVE&type=CORPORATE" \
  -H "Authorization: Bearer <admin-token>"
```

---

### `POST /clients`

Create a new client. **Requires ADMIN role.**

**Request Body:**
```json
{
  "userId": "uuid",
  "companyName": "GreenOffice Co",
  "industry": "Real Estate",
  "type": "CORPORATE",
  "address": "456 Whitefield Main Road",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560066",
  "gstNumber": "29ABCDE1234F1Z5",
  "contactPerson": "Priya Patel",
  "contactPhone": "+919876543211",
  "contractStartDate": "2026-04-01",
  "contractEndDate": "2027-03-31"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { "id": "uuid", "companyName": "GreenOffice Co", "..." : "..." }
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/clients \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"userId":"uuid","companyName":"GreenOffice Co","type":"CORPORATE","city":"Bangalore","state":"Karnataka"}'
```

---

### `GET /clients/:id`

Get a client by ID. **Requires authentication.**

**Example:**
```bash
curl http://localhost:4000/api/v1/clients/uuid-here \
  -H "Authorization: Bearer <token>"
```

---

### `PUT /clients/:id`

Update a client. **Requires ADMIN role.**

**Example:**
```bash
curl -X PUT http://localhost:4000/api/v1/clients/uuid-here \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"SUSPENDED","notes":"Contract under review"}'
```

---

### `DELETE /clients/:id`

Delete a client. **Requires ADMIN role.**

**Example:**
```bash
curl -X DELETE http://localhost:4000/api/v1/clients/uuid-here \
  -H "Authorization: Bearer <admin-token>"
```

---

### `GET /clients/:id/locations`

List all locations for a client. **Requires authentication.**

**Example:**
```bash
curl http://localhost:4000/api/v1/clients/uuid-here/locations \
  -H "Authorization: Bearer <token>"
```

---

### `POST /clients/:id/locations`

Add a location to a client. **Requires ADMIN role.**

**Request Body:**
```json
{
  "name": "Building A - Floor 3",
  "address": "456 Whitefield Main Road",
  "city": "Bangalore",
  "floor": "3",
  "area": 2500.0,
  "type": "OFFICE"
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/clients/uuid-here/locations \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Building A - Floor 3","type":"OFFICE","area":2500}'
```

---

## Plants Endpoints

### `GET /plants`

List all plants with pagination and filtering. **Requires authentication.**

**Query Parameters:**

| Param        | Type   | Default | Description                                        |
|--------------|--------|---------|----------------------------------------------------|
| `page`       | number | 1       | Page number                                        |
| `limit`      | number | 20      | Items per page                                     |
| `status`     | string | -       | Filter: HEALTHY, NEEDS_ATTENTION, CRITICAL, etc.   |
| `locationId` | string | -       | Filter by location UUID                            |
| `speciesId`  | string | -       | Filter by species UUID                             |
| `clientId`   | string | -       | Filter by client UUID                              |
| `search`     | string | -       | Search by nickname or species name                 |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "plants": [
      {
        "id": "uuid",
        "speciesId": "uuid",
        "locationId": "uuid",
        "nickname": "Office Fern",
        "status": "HEALTHY",
        "qrCode": "VRK-P-001",
        "wateringCycle": 3,
        "growthStage": "MATURE",
        "lastMaintenance": "2026-03-10T00:00:00.000Z",
        "species": { "commonName": "Boston Fern", "scientificName": "Nephrolepis exaltata" },
        "location": { "name": "Reception", "type": "LOBBY" }
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
  }
}
```

**Example:**
```bash
curl "http://localhost:4000/api/v1/plants?status=HEALTHY&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

### `POST /plants`

Add a new plant. **Requires ADMIN or TECHNICIAN role.**

**Request Body:**
```json
{
  "speciesId": "uuid",
  "locationId": "uuid",
  "nickname": "Meeting Room Snake Plant",
  "wateringCycle": 7,
  "growthStage": "MATURE",
  "notes": "Placed near the window"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "qrCode": "VRK-P-151",
    "nickname": "Meeting Room Snake Plant",
    "status": "HEALTHY",
    "..."
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/plants \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"speciesId":"uuid","locationId":"uuid","nickname":"Meeting Room Snake Plant","wateringCycle":7}'
```

---

### `GET /plants/:id`

Get plant details including recent health logs. **Requires authentication.**

**Example:**
```bash
curl http://localhost:4000/api/v1/plants/uuid-here \
  -H "Authorization: Bearer <token>"
```

---

### `PUT /plants/:id`

Update plant details. **Requires ADMIN or TECHNICIAN role.**

**Example:**
```bash
curl -X PUT http://localhost:4000/api/v1/plants/uuid-here \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"NEEDS_ATTENTION","notes":"Yellowing leaves observed"}'
```

---

### `DELETE /plants/:id`

Remove a plant (soft delete). **Requires ADMIN role.**

**Example:**
```bash
curl -X DELETE http://localhost:4000/api/v1/plants/uuid-here \
  -H "Authorization: Bearer <admin-token>"
```

---

### `GET /plants/:id/health-logs`

Get health log history for a plant. **Requires authentication.**

**Query Parameters:**

| Param   | Type   | Default | Description  |
|---------|--------|---------|--------------|
| `page`  | number | 1       | Page number  |
| `limit` | number | 20      | Items per page |

**Example:**
```bash
curl "http://localhost:4000/api/v1/plants/uuid-here/health-logs?limit=10" \
  -H "Authorization: Bearer <token>"
```

---

### `POST /plants/:id/health-logs`

Record a health log entry. **Requires TECHNICIAN or ADMIN role.**

**Request Body:**
```json
{
  "healthScore": 8.5,
  "notes": "Plant is thriving, new growth visible",
  "temperature": 24.5,
  "humidity": 65.0,
  "soilMoisture": 45.0,
  "lightLevel": 300.0,
  "diseaseDetected": null,
  "imageUrl": "https://cdn.vriksham.com/health/img123.jpg"
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/plants/uuid-here/health-logs \
  -H "Authorization: Bearer <tech-token>" \
  -H "Content-Type: application/json" \
  -d '{"healthScore":8.5,"notes":"Plant is thriving","temperature":24.5,"humidity":65}'
```

---

### `GET /plants/species`

List all plant species in the catalog. **Public endpoint.**

**Query Parameters:**

| Param      | Type   | Default | Description                        |
|------------|--------|---------|------------------------------------|
| `page`     | number | 1       | Page number                        |
| `limit`    | number | 50      | Items per page                     |
| `category` | string | -       | Filter by category                 |
| `light`    | string | -       | Filter: LOW, MEDIUM, HIGH, DIRECT_SUNLIGHT |
| `search`   | string | -       | Search by common or scientific name |

**Example:**
```bash
curl "http://localhost:4000/api/v1/plants/species?category=Indoor&light=LOW"
```

---

## Subscriptions Endpoints

### `GET /subscriptions`

List subscriptions. **Requires authentication.**

**Query Parameters:**

| Param      | Type   | Default | Description                                    |
|------------|--------|---------|------------------------------------------------|
| `page`     | number | 1       | Page number                                    |
| `limit`    | number | 20      | Items per page                                 |
| `status`   | string | -       | Filter: ACTIVE, PAUSED, CANCELLED, EXPIRED, TRIAL |
| `clientId` | string | -       | Filter by client UUID                          |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "id": "uuid",
        "clientId": "uuid",
        "planId": "uuid",
        "status": "ACTIVE",
        "billingCycle": "MONTHLY",
        "startDate": "2026-01-01T00:00:00.000Z",
        "endDate": null,
        "plan": { "name": "Professional", "monthlyPrice": 4999 },
        "client": { "companyName": "TechCorp India" }
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 8, "totalPages": 1 }
  }
}
```

**Example:**
```bash
curl "http://localhost:4000/api/v1/subscriptions?status=ACTIVE" \
  -H "Authorization: Bearer <token>"
```

---

### `POST /subscriptions`

Create a new subscription. **Requires ADMIN role.**

**Request Body:**
```json
{
  "clientId": "uuid",
  "planId": "uuid",
  "billingCycle": "MONTHLY",
  "startDate": "2026-04-01"
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/subscriptions \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"clientId":"uuid","planId":"uuid","billingCycle":"MONTHLY"}'
```

---

### `GET /subscriptions/plans`

List available subscription plans. **Public endpoint.**

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Starter",
      "monthlyPrice": 1999,
      "quarterlyPrice": 5499,
      "annualPrice": 19999,
      "maxPlants": 25,
      "features": ["Weekly maintenance", "Health monitoring", "Email support"],
      "popular": false
    },
    {
      "id": "uuid",
      "name": "Professional",
      "monthlyPrice": 4999,
      "quarterlyPrice": 13499,
      "annualPrice": 49999,
      "maxPlants": 100,
      "features": ["Bi-weekly maintenance", "AI health analysis", "Priority support", "Replacement guarantee"],
      "popular": true
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:4000/api/v1/subscriptions/plans
```

---

### `PUT /subscriptions/:id`

Update a subscription (change plan, pause, resume). **Requires ADMIN role.**

**Example:**
```bash
curl -X PUT http://localhost:4000/api/v1/subscriptions/uuid-here \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"PAUSED"}'
```

---

### `DELETE /subscriptions/:id`

Cancel a subscription. **Requires ADMIN role.**

**Request Body (optional):**
```json
{
  "cancelReason": "Moving to a different provider"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:4000/api/v1/subscriptions/uuid-here \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"cancelReason":"Moving offices"}'
```

---

## Technicians Endpoints

### `GET /technicians`

List all technicians. **Requires ADMIN role.**

**Query Parameters:**

| Param       | Type    | Default | Description                |
|-------------|---------|---------|----------------------------|
| `page`      | number  | 1       | Page number                |
| `limit`     | number  | 20      | Items per page             |
| `available` | boolean | -       | Filter by availability     |
| `zone`      | string  | -       | Filter by active zone      |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "technicians": [
      {
        "id": "uuid",
        "userId": "uuid",
        "specialization": "Indoor Plants",
        "rating": 4.8,
        "totalVisits": 156,
        "activeZones": ["Whitefield", "Marathahalli"],
        "isAvailable": true,
        "certifications": ["Horticulture Diploma", "Pest Management"],
        "user": { "name": "Ravi Kumar", "email": "ravi@vriksham.com" }
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 8, "totalPages": 1 }
  }
}
```

**Example:**
```bash
curl "http://localhost:4000/api/v1/technicians?available=true" \
  -H "Authorization: Bearer <admin-token>"
```

---

### `POST /technicians`

Register a new technician. **Requires ADMIN role.**

**Request Body:**
```json
{
  "userId": "uuid",
  "specialization": "Indoor Plants",
  "activeZones": ["Whitefield", "Koramangala"],
  "certifications": ["Horticulture Diploma"]
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/technicians \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"userId":"uuid","specialization":"Indoor Plants","activeZones":["Whitefield"]}'
```

---

### `GET /technicians/:id`

Get technician details. **Requires authentication.**

**Example:**
```bash
curl http://localhost:4000/api/v1/technicians/uuid-here \
  -H "Authorization: Bearer <token>"
```

---

### `PUT /technicians/:id`

Update technician details. **Requires ADMIN role.**

**Example:**
```bash
curl -X PUT http://localhost:4000/api/v1/technicians/uuid-here \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"isAvailable":false,"activeZones":["HSR Layout","Koramangala"]}'
```

---

### `GET /technicians/:id/visits`

Get service visits assigned to a technician. **Requires authentication.**

**Example:**
```bash
curl "http://localhost:4000/api/v1/technicians/uuid-here/visits?status=SCHEDULED" \
  -H "Authorization: Bearer <token>"
```

---

## Service Visits Endpoints

### `GET /service-visits`

List service visits. **Requires authentication.**

**Query Parameters:**

| Param          | Type   | Default | Description                                            |
|----------------|--------|---------|--------------------------------------------------------|
| `page`         | number | 1       | Page number                                            |
| `limit`        | number | 20      | Items per page                                         |
| `status`       | string | -       | Filter: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, MISSED |
| `type`         | string | -       | Filter: ROUTINE, EMERGENCY, REPLACEMENT, etc.          |
| `technicianId` | string | -       | Filter by technician UUID                              |
| `plantId`      | string | -       | Filter by plant UUID                                   |
| `from`         | string | -       | Start date (ISO 8601)                                  |
| `to`           | string | -       | End date (ISO 8601)                                    |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "visits": [
      {
        "id": "uuid",
        "plantId": "uuid",
        "technicianId": "uuid",
        "scheduledDate": "2026-03-20T09:00:00.000Z",
        "type": "ROUTINE",
        "status": "SCHEDULED",
        "plant": { "nickname": "Office Fern", "location": { "name": "Reception" } },
        "technician": { "user": { "name": "Ravi Kumar" } }
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 45, "totalPages": 3 }
  }
}
```

**Example:**
```bash
curl "http://localhost:4000/api/v1/service-visits?status=SCHEDULED&from=2026-03-15" \
  -H "Authorization: Bearer <token>"
```

---

### `POST /service-visits`

Schedule a new service visit. **Requires ADMIN role.**

**Request Body:**
```json
{
  "plantId": "uuid",
  "technicianId": "uuid",
  "scheduledDate": "2026-03-20T09:00:00.000Z",
  "type": "ROUTINE",
  "notes": "Regular weekly check"
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/service-visits \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"plantId":"uuid","technicianId":"uuid","scheduledDate":"2026-03-20T09:00:00.000Z","type":"ROUTINE"}'
```

---

### `GET /service-visits/:id`

Get a service visit by ID. **Requires authentication.**

**Example:**
```bash
curl http://localhost:4000/api/v1/service-visits/uuid-here \
  -H "Authorization: Bearer <token>"
```

---

### `PUT /service-visits/:id`

Update a service visit (complete, cancel, add feedback). **Requires authentication.**

**Request Body (completing a visit):**
```json
{
  "status": "COMPLETED",
  "completedDate": "2026-03-20T10:30:00.000Z",
  "durationMinutes": 45,
  "notes": "Watered, pruned dead leaves, applied fertilizer",
  "beforeImageUrl": "https://cdn.vriksham.com/visits/before-123.jpg",
  "afterImageUrl": "https://cdn.vriksham.com/visits/after-123.jpg"
}
```

**Example:**
```bash
curl -X PUT http://localhost:4000/api/v1/service-visits/uuid-here \
  -H "Authorization: Bearer <tech-token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"COMPLETED","durationMinutes":45,"notes":"Routine maintenance done"}'
```

---

### `POST /service-visits/:id/feedback`

Submit client feedback for a completed visit. **Requires CLIENT role.**

**Request Body:**
```json
{
  "rating": 4.5,
  "clientFeedback": "Excellent service, plants look great!"
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/service-visits/uuid-here/feedback \
  -H "Authorization: Bearer <client-token>" \
  -H "Content-Type: application/json" \
  -d '{"rating":4.5,"clientFeedback":"Excellent service!"}'
```

---

## Payments Endpoints

### `GET /payments/invoices`

List invoices. **Requires authentication.**

**Query Parameters:**

| Param      | Type   | Default | Description                                    |
|------------|--------|---------|------------------------------------------------|
| `page`     | number | 1       | Page number                                    |
| `limit`    | number | 20      | Items per page                                 |
| `status`   | string | -       | Filter: PENDING, PAID, OVERDUE, CANCELLED      |
| `clientId` | string | -       | Filter by client UUID                          |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "uuid",
        "invoiceNumber": "VRK-INV-2026-001",
        "clientId": "uuid",
        "amount": 4999.00,
        "tax": 899.82,
        "discount": 0,
        "total": 5898.82,
        "status": "PENDING",
        "dueDate": "2026-04-01T00:00:00.000Z",
        "client": { "companyName": "TechCorp India" }
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 24, "totalPages": 2 }
  }
}
```

**Example:**
```bash
curl "http://localhost:4000/api/v1/payments/invoices?status=PENDING" \
  -H "Authorization: Bearer <token>"
```

---

### `POST /payments/invoices`

Create a new invoice. **Requires ADMIN role.**

**Request Body:**
```json
{
  "clientId": "uuid",
  "subscriptionId": "uuid",
  "amount": 4999.00,
  "tax": 899.82,
  "total": 5898.82,
  "dueDate": "2026-04-01",
  "billingPeriodStart": "2026-03-01",
  "billingPeriodEnd": "2026-03-31"
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/payments/invoices \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"clientId":"uuid","amount":4999,"tax":899.82,"total":5898.82,"dueDate":"2026-04-01"}'
```

---

### `GET /payments/invoices/:id`

Get invoice details with payment history. **Requires authentication.**

**Example:**
```bash
curl http://localhost:4000/api/v1/payments/invoices/uuid-here \
  -H "Authorization: Bearer <token>"
```

---

### `POST /payments/process`

Process a payment for an invoice. **Requires authentication.**

**Request Body:**
```json
{
  "invoiceId": "uuid",
  "amount": 5898.82,
  "method": "STRIPE",
  "stripePaymentId": "pi_3abc123..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "invoiceId": "uuid",
    "amount": 5898.82,
    "method": "STRIPE",
    "status": "SUCCESS",
    "paidAt": "2026-03-15T14:30:00.000Z"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/payments/process \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"invoiceId":"uuid","amount":5898.82,"method":"STRIPE","stripePaymentId":"pi_3abc..."}'
```

---

### `POST /payments/stripe/create-intent`

Create a Stripe Payment Intent. **Requires authentication.**

**Request Body:**
```json
{
  "invoiceId": "uuid",
  "amount": 5898.82
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_3abc_secret_xyz"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/payments/stripe/create-intent \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"invoiceId":"uuid","amount":5898.82}'
```

---

### `POST /payments/webhooks/stripe`

Stripe webhook handler. **No authentication (verified by Stripe signature).**

This endpoint receives Stripe webhook events (`invoice.paid`, `payment_intent.succeeded`, `payment_intent.payment_failed`, etc.) and updates payment/invoice records accordingly.

---

## Analytics Endpoints

### `GET /analytics/dashboard`

Get dashboard analytics overview. **Requires ADMIN role.**

**Query Parameters:**

| Param  | Type   | Default   | Description                    |
|--------|--------|-----------|--------------------------------|
| `from` | string | 30d ago   | Start date (ISO 8601)          |
| `to`   | string | now       | End date (ISO 8601)            |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalClients": 45,
    "activeSubscriptions": 38,
    "totalPlants": 1250,
    "healthyPlants": 1100,
    "criticalPlants": 15,
    "totalRevenue": 245000,
    "pendingPayments": 32500,
    "visitCompletionRate": 94.5,
    "averageRating": 4.6,
    "revenueChart": [
      { "month": "2026-01", "revenue": 78500 },
      { "month": "2026-02", "revenue": 82000 },
      { "month": "2026-03", "revenue": 84500 }
    ],
    "plantHealthDistribution": {
      "HEALTHY": 1100,
      "NEEDS_ATTENTION": 120,
      "CRITICAL": 15,
      "REPLACED": 10,
      "REMOVED": 5
    }
  }
}
```

**Example:**
```bash
curl "http://localhost:4000/api/v1/analytics/dashboard?from=2026-01-01&to=2026-03-15" \
  -H "Authorization: Bearer <admin-token>"
```

---

### `GET /analytics/plants`

Get plant health analytics. **Requires authentication.**

**Example:**
```bash
curl "http://localhost:4000/api/v1/analytics/plants?clientId=uuid" \
  -H "Authorization: Bearer <token>"
```

---

### `GET /analytics/revenue`

Get revenue analytics with breakdown. **Requires ADMIN role.**

**Query Parameters:**

| Param     | Type   | Default   | Description                          |
|-----------|--------|-----------|--------------------------------------|
| `from`    | string | 12m ago   | Start date                           |
| `to`      | string | now       | End date                             |
| `groupBy` | string | month     | Group by: day, week, month, quarter  |

**Example:**
```bash
curl "http://localhost:4000/api/v1/analytics/revenue?groupBy=month" \
  -H "Authorization: Bearer <admin-token>"
```

---

### `GET /analytics/technicians`

Get technician performance analytics. **Requires ADMIN role.**

**Example:**
```bash
curl http://localhost:4000/api/v1/analytics/technicians \
  -H "Authorization: Bearer <admin-token>"
```

---

## AI Endpoints

### `POST /ai/analyze-plant`

Analyze a plant image using AI for health assessment. **Requires authentication.**

**Request (multipart/form-data):**

| Field   | Type | Description            |
|---------|------|------------------------|
| `image` | file | Plant image (JPG/PNG)  |
| `plantId` | string | Plant UUID (optional) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "healthScore": 7.5,
    "condition": "NEEDS_ATTENTION",
    "issues": [
      "Minor yellowing on lower leaves",
      "Slight overwatering signs"
    ],
    "recommendations": [
      "Reduce watering frequency to once every 5 days",
      "Move to a slightly brighter location",
      "Remove yellowed lower leaves"
    ],
    "diseaseDetected": null,
    "confidence": 0.89
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/ai/analyze-plant \
  -H "Authorization: Bearer <token>" \
  -F "image=@plant-photo.jpg" \
  -F "plantId=uuid-here"
```

---

### `POST /ai/care-recommendations`

Get AI-powered care recommendations for a plant. **Requires authentication.**

**Request Body:**
```json
{
  "plantId": "uuid",
  "currentConditions": {
    "temperature": 26.5,
    "humidity": 55.0,
    "lightLevel": 250.0,
    "soilMoisture": 30.0
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      "Water within the next 24 hours - soil moisture is below optimal",
      "Current light levels are adequate for this species",
      "Consider misting leaves to increase local humidity"
    ],
    "nextWatering": "2026-03-16T09:00:00.000Z",
    "optimalConditions": {
      "temperatureRange": { "min": 18, "max": 30 },
      "humidityRange": { "min": 50, "max": 80 },
      "lightRange": { "min": 200, "max": 500 }
    }
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/ai/care-recommendations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"plantId":"uuid","currentConditions":{"temperature":26.5,"humidity":55,"lightLevel":250,"soilMoisture":30}}'
```

---

## Inventory Endpoints

### `GET /inventory`

List inventory items. **Requires ADMIN role.**

**Query Parameters:**

| Param      | Type    | Default | Description                |
|------------|---------|---------|----------------------------|
| `page`     | number  | 1       | Page number                |
| `limit`    | number  | 20      | Items per page             |
| `lowStock` | boolean | false   | Filter for low stock items |
| `speciesId`| string  | -       | Filter by species UUID     |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "inventory": [
      {
        "id": "uuid",
        "speciesId": "uuid",
        "quantity": 15,
        "cost": 350.00,
        "supplier": "Green Nursery Pvt Ltd",
        "supplierPhone": "+919876543210",
        "minStock": 5,
        "lastRestocked": "2026-03-01T00:00:00.000Z",
        "species": { "commonName": "Money Plant", "scientificName": "Epipremnum aureum" }
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 35, "totalPages": 2 }
  }
}
```

**Example:**
```bash
curl "http://localhost:4000/api/v1/inventory?lowStock=true" \
  -H "Authorization: Bearer <admin-token>"
```

---

### `POST /inventory`

Add inventory item. **Requires ADMIN role.**

**Request Body:**
```json
{
  "speciesId": "uuid",
  "quantity": 50,
  "cost": 350.00,
  "supplier": "Green Nursery Pvt Ltd",
  "supplierPhone": "+919876543210",
  "minStock": 10,
  "location": "Warehouse A"
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/v1/inventory \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"speciesId":"uuid","quantity":50,"cost":350,"supplier":"Green Nursery Pvt Ltd","minStock":10}'
```

---

### `PUT /inventory/:id`

Update inventory (restock, adjust quantity). **Requires ADMIN role.**

**Example:**
```bash
curl -X PUT http://localhost:4000/api/v1/inventory/uuid-here \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"quantity":75,"lastRestocked":"2026-03-15T00:00:00.000Z"}'
```

---

### `DELETE /inventory/:id`

Remove an inventory item. **Requires ADMIN role.**

**Example:**
```bash
curl -X DELETE http://localhost:4000/api/v1/inventory/uuid-here \
  -H "Authorization: Bearer <admin-token>"
```

---

## Error Responses

All endpoints return errors in a consistent format:

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

**Rate Limited (429):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests, please try again later"
  }
}
```

**Server Error (500):**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Rate Limiting

- Default: 100 requests per 15-minute window
- Auth endpoints: 20 requests per 15-minute window
- AI endpoints: 10 requests per minute
- Stripe webhook: No rate limit

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1710500000
```

---

## Pagination

All list endpoints support consistent pagination:

```
GET /resource?page=2&limit=20
```

Response includes a `pagination` object:
```json
{
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```
