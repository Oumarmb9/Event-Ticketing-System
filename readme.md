## Event Ticketing System

## Overview

A RESTful ticketing system backend built with Node.js, Express, and MongoDB. Features user authentication, event management, and seat booking with QR code generation and email notifications.

## Features

* **User Authentication**: Sign up and log in with JWT-based tokens.
* **Event Management**: Create, read, update, and delete events.
* **Booking System**: Reserve seats for events with capacity checks.
* **Email Notifications**: Sends confirmation emails with QR codes.
* **Error Handling**: Validation and friendly error responses for invalid requests.

## Tech Stack

* Node.js
* Express.js
* MongoDB with Mongoose
* JSON Web Tokens (JWT)
* Nodemailer (for email)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ticketing-system.git
   cd ticketing-system
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create an environment file by copying `.env.example`:

   ```bash
   cp .env.example .env
   ```
4. Fill in the required environment variables in `.env`.

## Environment Variables

```dotenv
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
EMAIL_HOST=<smtp-host>
EMAIL_PORT=<smtp-port>
EMAIL_USER=<smtp-username>
EMAIL_PASS=<smtp-password>
```

## Running the Server

```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | Register a new user      |
| POST   | `/api/auth/login`    | Log in and receive a JWT |

### Events

> **Protected**: JWT required in `Authorization: Bearer <token>` header

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| GET    | `/api/events`     | List all events      |
| GET    | `/api/events/:id` | Get event by ID      |
| POST   | `/api/events`     | Create a new event   |
| PUT    | `/api/events/:id` | Update event details |
| DELETE | `/api/events/:id` | Delete an event      |

### Bookings

> **Protected**: JWT required

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/bookings`     | List all your bookings  |
| POST   | `/api/bookings`     | Book seats for an event |
| GET    | `/api/bookings/:id` | Get booking by ID       |
| DELETE | `/api/bookings/:id` | Cancel a booking        |

#### Booking Request Body

```json
{
  "event": "<eventObjectId>",
  "quantity": <number_of_seats>
}
```

## QR Codes & Email

After a successful booking, a QR code is generated and emailed to the user. Configure your SMTP credentials in the `.env` file.

## Scripts

* `npm start`: Start the server
* `npm run dev`: Start the server with nodemon for development