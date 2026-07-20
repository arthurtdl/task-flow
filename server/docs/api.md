# TaskFlow API Documentation

## Base URL

`/api`

## Authentication

The API uses JWT Bearer Authentication.

### Public Endpoints

| Method | Endpoint |
|---|---|
| POST | `/api/auth/login` |
| POST | `/api/users` |
| GET | `/api/` |

All other endpoints require:

```http
Authorization: Bearer <access_token>
```

The login endpoint returns:
- Access Token in the response body.
- Refresh Token as an HttpOnly cookie.

---

## Standard Response

Success:

```json
{
  "message": "...",
  "data": {}
}
```

Delete endpoints return **204 No Content**.

---

# POST /api/auth/login

## Request

```json
{
  "email":"john@example.com",
  "password":"123456"
}
```

## Responses

- 200 Login successful
- 401 Invalid credentials
- 404 User not found

```json
{
  "message":"Login successful.",
  "data":{
    "accessToken":"<jwt>",
    "user":{
      "id":"uuid",
      "name":"John Doe",
      "email":"john@example.com",
      "role":"USER"
    }
  }
}
```

---

# POST /api/users

Creates a user.

## Body

| Field | Type | Required |
|---|---|:---:|
| name | string | ✅ |
| email | string | ✅ |
| password | string (min 6) | ✅ |

Responses:
- 201 Created
- 400 Validation error
- 409 Email already exists

---

# GET /api/users/{email}

Responses:
- 200 OK
- 401 Unauthorized
- 404 User not found

---

# POST /api/tasks

Requires authentication.

Fields:
- title*
- description
- deadline
- status: BACKLOG, PENDING, IN_PROGRESS, COMPLETED
- isPriority
- userId*

Responses:
- 201 Created
- 400 Validation error
- 401 Unauthorized
- 404 User not found

---

# GET /api/tasks

- 200 OK

# GET /api/tasks/{id}

- 200 OK
- 401 Unauthorized
- 404 Task not found

# GET /api/tasks/user/{userId}

- 200 OK
- 401 Unauthorized
- 404 User not found

# PATCH /api/tasks/{id}

Optional fields:
- title
- description
- deadline
- status
- isPriority

Responses:
- 200 OK
- 400 Validation error
- 401 Unauthorized
- 404 Task not found

# DELETE /api/tasks/{id}

- 204 No Content
- 401 Unauthorized
- 404 Task not found

---

# POST /api/attachments

Fields:
- fileName
- fileUrl
- fileType
- taskId

Responses:
- 201 Created
- 400 Validation error
- 401 Unauthorized
- 404 Task not found

# GET /api/attachments/task/{taskId}

- 200 OK
- 401 Unauthorized
- 404 Task not found

# DELETE /api/attachments/{id}

- 204 No Content
- 401 Unauthorized
- 404 Attachment not found
