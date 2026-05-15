# TrimUrl — URL Shortener

> A full-stack URL shortener with analytics, QR code generation, link protection, tag management, and a REST API with API key authentication.

🌐 **Live App:** [https://trimurl.site](https://trimurl.site)
📄 **API Docs:** [https://trim-url-gpxt.onrender.com/api/docs/](https://trim-url-gpxt.onrender.com/api/docs/)
🗄️ **Backend Repo:** [github.com/Adhithya200503/trimos-backend](https://github.com/Adhithya200503/trimos-backend)

---

## ✨ Features

- 🔗 **URL Shortening** — Create short links with optional custom slugs
- 🔒 **Link Protection** — Password-protect individual links
- 📊 **Analytics** — Track click counts per link with detailed analytics
- 🏷️ **Tag Management** — Organize links with custom tags and filter by them
- 📷 **QR Code Generator** — Generate and save QR codes for any link
- 🔑 **API Key Access** — Programmatic access via named API tokens
- 📖 **Swagger API Docs** — Interactive REST API documentation
- 🔐 **Google OAuth** — Sign in with Google
- 📄 **Export** — Export link data as PDF

---

## 🏗️ Project Structure

```
TrimUrl/
├── backend/      # Node.js + Express REST API
└── frontend/     # React + Vite web application
```

---

## 🖥️ Backend

**Stack:** Node.js · Express 5 · MongoDB (Mongoose) · JWT · Swagger

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)

### Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT_NUMBER=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7h
MODE=dev
FRONTEND_END_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Run

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:8080`.
Swagger docs are available at `http://localhost:8080/api/docs`.

### API Overview

All protected endpoints require authentication via:

**Header:**
```
x-api-key: YOUR_API_KEY
```
or
```
Authorization: Bearer YOUR_API_KEY
```

> Generate your API key from the **Settings → API Tokens** section of the dashboard.

| Method   | Endpoint                    | Description                          |
|----------|-----------------------------|--------------------------------------|
| `POST`   | `/auth/register`            | Register a new user                  |
| `POST`   | `/auth/login`               | Login and receive a session cookie   |
| `POST`   | `/api/v1/create`            | Create a short URL                   |
| `GET`    | `/api/v1/short-urls`        | List all URLs for the user           |
| `GET`    | `/api/v1/short-url/:slug`   | Get a specific URL by slug           |
| `PUT`    | `/api/v1/short-url/:id`     | Update a short URL                   |
| `DELETE` | `/api/v1/delete/:slug`      | Delete a short URL                   |
| `GET`    | `/api/v1/search`            | Search URLs by tag or date           |
| `GET`    | `/api/v1/tags`              | List all tags                        |
| `GET`    | `/api/v1/filter/:sort`      | Filter by `active`, `inactive`, etc. |
| `GET`    | `/api/v1/total-short-urls`  | Get total URL count                  |
| `POST`   | `/api/v1/qrcode`            | Save a QR code                       |
| `GET`    | `/api/v1/my-qrcodes`        | List saved QR codes                  |
| `DELETE` | `/api/v1/qrcodes/:id`       | Delete a QR code                     |
| `POST`   | `/api/v1/create-token`      | Create a named API token             |
| `GET`    | `/api/v1/tokens`            | List all API tokens                  |
| `DELETE` | `/api/v1/delete-token`      | Delete an API token                  |
| `GET`    | `/:slug`                    | Redirect to the destination URL      |

> 🧪 **Try the API interactively:** Visit [https://trim-url-gpxt.onrender.com/api/docs/](https://trim-url-gpxt.onrender.com/api/docs/) to explore and test all endpoints directly in your browser.

---

## 🌐 Frontend

**Stack:** React 18 · Vite · Tailwind CSS (DaisyUI) · React Router v6 · Recharts · Axios

### Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8080
```

### Run

```bash
npm run dev
```

The app starts at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

### Pages & Routes

| Route                      | Description                              |
|----------------------------|------------------------------------------|
| `/`                        | Home — shorten a URL or generate QR code |
| `/links`                   | Dashboard — manage all your short links  |
| `/link-details/:slug`      | Link detail view                         |
| `/analytics/:slug`         | Per-link click analytics                 |
| `/analytics`               | Global analytics overview                |
| `/tags`                    | Browse links by tag                      |
| `/qr-codes`                | Saved QR codes                           |
| `/filter/:sort`            | Filtered link views (active/inactive...) |
| `/settings`                | Account settings & API token management  |
| `/user-profile`            | User profile                             |
| `/protected/:slug`         | Password entry page for protected links  |
| `/login`                   | Login (email/password or Google OAuth)   |
| `/signup`                  | Register                                 |

---

## 🔐 Authentication

TrimUrl supports two authentication methods:

1. **Session-based (Cookie + JWT)** — Used by the web dashboard. Login via `/auth/login` sets an HTTP-only cookie automatically.
2. **API Key** — For external/programmatic access. Pass the key as `x-api-key` header or Bearer token. Generate keys from the Settings page.

---

## 🚀 Deployment

| Service     | Component |
|-------------|-----------|
| Render      | Backend API |
| Render      | Frontend static site |
| MongoDB Atlas | Database |

**Production URLs:**
- Frontend: [https://trimurl.site](https://trimurl.site)
- Backend API: [https://trim-url-gpxt.onrender.com](https://trim-url-gpxt.onrender.com)
- API Docs: [https://trim-url-gpxt.onrender.com/api/docs/](https://trim-url-gpxt.onrender.com/api/docs/)

**GitHub Repositories:**
- Backend: [github.com/Adhithya200503/trimos-backend](https://github.com/Adhithya200503/trimos-backend)

---

## 📦 Tech Stack Summary

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React, Vite, TailwindCSS, DaisyUI, Recharts     |
| Backend    | Node.js, Express 5, Mongoose                    |
| Database   | MongoDB Atlas                                   |
| Auth       | JWT, bcryptjs, Google OAuth 2.0                 |
| API Docs   | Swagger (OpenAPI 3.0)                           |
| QR Codes   | `qrcode` npm package                            |
| PDF Export | jsPDF, jspdf-autotable                          |

---

## 📄 License

ISC © Adhithya S
