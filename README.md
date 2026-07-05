<p align="center">
  <img src="https://github.com/user-attachments/assets/be1da403-62c4-4056-89e0-c10787ce77df" width="220" alt="PlusAPI Logo" />
</p>

<h1 align="center">PulseAPI</h1>

<p align="center">
A modern API testing and debugging platform for developers.
</p>

---

## Overview

**PulseAPI** is a modern API testing and debugging platform inspired by tools like **Postman** and **Insomnia**. It provides a clean interface for testing REST APIs, organizing requests, managing environments, and inspecting responses.

The long-term vision is to integrate AI-powered capabilities that simplify API development, debugging, and documentation.

---

## Features

### Request Builder

- Support for all major HTTP methods
  - GET
  - POST
  - PUT
  - PATCH
  - DELETE
  - OPTIONS
  - HEAD
- URL editor
- Query Parameters
- Request Headers
- JSON Request Body
- Authentication support *(Coming Soon)*

---

### Response Viewer

- HTTP Status Code
- Response Headers
- Formatted JSON Response
- Response Time
- Response Size
- Error Handling

---

### Request History

- Automatically stores every executed request
- View previous requests
- Delete individual history entries
- Clear entire history

---

### Collections

- Organize API requests
- Save reusable requests
- Update collections
- Delete collections

---

## Environments

PulseAPI supports reusable environments such as:

- Development
- Production
- Testing
- Local

Each environment contains a set of reusable variables.

<p align="center">
<img src="https://github.com/user-attachments/assets/dc0765dc-5508-4a8a-a2ff-797f3f6316c2" width="650" />
</p>

For example, you can register variables like:

| Variable | Value |
|----------|-------|
| `baseUrl` | `https://jsonplaceholder.typicode.com` |
| `token` | `eyJhbGc...` |
| `apiKey` | `xxxxxxxx` |

Once an environment is selected, use variables anywhere inside the request.

### URL

```text
{{baseUrl}}/posts
```

### Headers

```json
{
  "Authorization": "Bearer {{token}}",
  "x-api-key": "{{apiKey}}"
}
```

### Query Parameters

```json
{
  "page": "1",
  "version": "{{version}}"
}
```

### Request Body

```json
{
  "username": "john",
  "token": "{{token}}"
}
```

Before sending the request, PulseAPI automatically replaces every placeholder with its corresponding value from the selected environment.

This makes switching between Development, Testing, and Production environments effortless without editing individual requests.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- Axios

### Database

- MongoDB
- Mongoose

### Deployment

- Frontend — Vercel
- Backend — Render
- Database — MongoDB Atlas

---

## Backend Architecture

```text
Browser
    │
    ▼
POST /api/request
    │
    ▼
Express Server
    │
    ▼
Request Service
    │
    ▼
Environment Variable Resolver
    │
    ▼
Axios
    │
    ▼
Target API
    │
    ▼
Response
    │
    ▼
History
    │
    ▼
Browser
```

---

## Database Collections

- Collection
- Request
- History
- Environment
- User *(Planned)*

---

## API Endpoints

### Execute Request

```http
POST /api/request
```

### History

```http
GET    /api/history
DELETE /api/history/:id
DELETE /api/history
```

### Collections

```http
GET    /api/collection
POST   /api/collection
PUT    /api/collection/:id
DELETE /api/collection/:id
```

### Environments

```http
GET    /api/environment
POST   /api/environment
PUT    /api/environment/:id
DELETE /api/environment/:id
```

---

## Getting Started

### Clone the Repository

```bash
git clone <repository-url>

cd PulseAPI
```

---

### Install Frontend

```bash
cd frontend

npm install

npm run dev
```

---

### Install Backend

```bash
cd backend

npm install

npm run dev
```

---

### Environment Variables

Frontend

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Backend

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## Roadmap

### Version 1

- API Request Builder
- Response Viewer
- HTTP Methods Support
- Backend Request Proxy

### Version 2

- Request History
- Collections
- Environment Management

### Version 3

- Authentication
- Workspaces
- Favorites
- cURL Import & Export
- Code Generation

### Version 4

- AI Request Generation
- AI Response Explanation
- AI Documentation
- AI Debugging
- API Flow Visualization

---

## Future Plans

- OpenAPI / Swagger Import
- GraphQL Support
- WebSocket Testing
- gRPC Support
- Automated API Testing
- Response Comparison
- Keyboard Shortcuts
- Team Collaboration
- Desktop Application
- Plugin System

---

## License

This project is licensed under the **MIT License**.
