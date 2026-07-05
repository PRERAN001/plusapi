# PulseAPI

**PulseAPI** is a modern API testing and debugging platform built for developers. Inspired by tools like Postman and Insomnia, it provides a clean interface for testing REST APIs, organizing requests, managing environments, and inspecting responses. The long-term vision is to integrate AI-powered features that simplify API development, debugging, and documentation.

## Features

### Request Builder

* Support for HTTP methods:

  * GET
  * POST
  * PUT
  * PATCH
  * DELETE
  * OPTIONS
  * HEAD
* Request URL editor
* Query parameter management
* Request headers
* JSON request body
* Authentication support (planned)

### Response Viewer

* HTTP status code
* Response headers
* Formatted JSON response
* Response time
* Response size
* Error handling

### Request History

* Automatically stores every executed request
* View previous requests
* Delete individual history entries
* Clear complete history

### Collections

* Create collections
* Organize API requests
* Save frequently used requests
* Update and delete collections

### Environments

Create reusable environments such as Development, Production, Testing, and Local.

Store reusable variables including:

```text
{{baseUrl}}

{{token}}

{{apiKey}}
```

Switch between environments without modifying individual requests.

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* Axios

### Database

* MongoDB
* Mongoose

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

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
Axios
    │
    ▼
Target API
    │
    ▼
Response
    │
    ▼
Browser
```

## Database Collections

* Collection
* Request
* History
* Environment
* User (planned)

## API Endpoints

### Execute Request

```http
POST /api/request
```

### History

```http
GET /api/history
DELETE /api/history/:id
DELETE /api/history
```

### Collections

```http
GET /api/collection
POST /api/collection
PUT /api/collection/:id
DELETE /api/collection/:id
```

### Environments

```http
GET /api/environment
POST /api/environment
PUT /api/environment/:id
DELETE /api/environment/:id
```

## Getting Started

### Clone the repository

```bash
git clone <repository-url>
cd PulseAPI
```

### Install dependencies

Frontend

```bash
cd frontend
npm install
npm run dev
```

Backend

```bash
cd backend
npm install
npm run dev
```

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

## Roadmap

### Version 1

* API request builder
* Response viewer
* Support for multiple HTTP methods
* Backend request proxy

### Version 2

* Request history
* Collections
* Environment management

### Version 3

* Authentication
* Workspaces
* Favorites
* cURL import and export
* Code generation

### Version 4

* AI request generation
* AI response explanation
* AI documentation generation
* AI debugging assistant
* API flow visualization

## Future Plans

* OpenAPI/Swagger import
* GraphQL support
* WebSocket testing
* gRPC support
* Automated API testing
* Response comparison
* Keyboard shortcuts
* Team collaboration
* Desktop application
* Plugin system

## License

This project is licensed under the MIT License.
