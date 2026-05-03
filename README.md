# Project Messenger

A full-stack real-time messenger application built with **Java Spring Boot**, **React (TypeScript)**, and **OAuth 2.0** security.

## Features

- **OAuth 2.0 Authentication** - Sign in with Google or GitHub
- **Real-time Messaging** - WebSocket (STOMP over SockJS) for instant message delivery
- **Conversations** - Direct messages and group chats
- **User Search** - Find and connect with other users
- **Online Status** - See who's currently online
- **Typing Indicators** - Know when someone is typing
- **Responsive UI** - Clean, modern interface

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2
- Spring Security with OAuth2 Client
- Spring WebSocket (STOMP)
- Spring Data JPA
- H2 Database (dev) / PostgreSQL (prod)

### Frontend
- React 18 with TypeScript
- React Router v6
- STOMP.js + SockJS for WebSocket
- Axios for HTTP requests

## Prerequisites

- Java 17+
- Node.js 18+
- Maven 3.9+
- Google OAuth2 credentials (Client ID & Secret)
- GitHub OAuth App credentials (optional)

## Setup

### 1. Configure OAuth2 Credentials

#### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID (Web application)
5. Add `http://localhost:8080/login/oauth2/code/google` as an authorized redirect URI

#### GitHub
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:8080/login/oauth2/code/github`

### 2. Set Environment Variables

```bash
export GOOGLE_CLIENT_ID=your-google-client-id
export GOOGLE_CLIENT_SECRET=your-google-client-secret
export GITHUB_CLIENT_ID=your-github-client-id
export GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 3. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`.

### 4. Run the Frontend

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`.

## Project Structure

```
project-messenger/
├── backend/
│   ├── src/main/java/com/messenger/
│   │   ├── config/          # Security, WebSocket, CORS config
│   │   ├── controller/      # REST & WebSocket controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Data access layer
│   │   └── service/         # Business logic
│   └── src/main/resources/
│       └── application.yml  # App configuration
├── frontend/
│   ├── src/
│   │   ├── components/      # React UI components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API & WebSocket services
│   │   └── types/           # TypeScript interfaces
│   └── public/
└── README.md
```

## API Endpoints

| Method | Endpoint                           | Description                |
|--------|------------------------------------|----------------------------|
| GET    | `/api/auth/user`                   | Get current user           |
| GET    | `/api/auth/status`                 | Check auth status          |
| GET    | `/api/users`                       | List all users             |
| GET    | `/api/users/search?query=`         | Search users by name       |
| GET    | `/api/users/online`                | List online users          |
| GET    | `/api/conversations`               | Get user's conversations   |
| POST   | `/api/conversations`               | Create new conversation    |
| GET    | `/api/messages/conversation/{id}`  | Get messages (paginated)   |

## WebSocket Endpoints

| Destination                              | Description          |
|------------------------------------------|----------------------|
| `/app/chat.sendMessage`                  | Send a message       |
| `/app/chat.typing`                       | Send typing event    |
| `/topic/conversation.{id}`               | Subscribe to messages|
| `/topic/conversation.{id}.typing`        | Subscribe to typing  |

## License

MIT
