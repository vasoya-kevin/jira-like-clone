# Full Stack Application

This repository contains **both the frontend and backend (server)** required to run the application locally.

---

## 📁 Project Structure

root/
├── frontend/ # Frontend application
├── server/ # Backend / API server
└── README.mdx

---

## ✅ Prerequisites

Make sure the following tools are installed before starting:

- **Node.js**: `v22.21.1`
- **pnpm**: Package manager used for both frontend and server

### Install pnpm globally (if not installed)

```bash
npm install -g pnpm
```

1️⃣ Install Dependencies

Install dependencies separately for both frontend and server.

Frontend
cd frontend
pnpm install

Server
cd server
pnpm install

Environment Variables

Create a .env file inside the server root directory.

Example folder structure:

server/
├── src/
├── .env
├── package.json

Add the required environment variables (such as database configuration, secrets, and ports) inside the .env file.

```PORT=9090 
    MONGOOSE_URL=mongodb+srv://vasoyastar_db_user:WlBPzDA8zfNzGnI2@cluster0.aovscxn.mongodb.net/?appName=Cluster0 
    MONGOOSE_PASSWORD=WlBPzDA8zfNzGnI2 
    MONGOOSE_USER_NAME=vasoyastar_db_user 
    SECRET_KEY=KEVIN_VASOYA@2025 
    ENVIRONMENT="development"```

⚠️ Important:
Do NOT commit the .env file to version control.

3️⃣ Run the Application

Start the development servers:

pnpm run dev

You may need to run this command separately in both frontend and server directories depending on project configuration.

🌐 Application URLs

Once running, the application will be available at:

Frontend: http://localhost:1611

Backend (API Server): http://localhost:9090

🛠 Tech Stack

Frontend: JavaScript / TypeScript

Backend: Node.js

Package Manager: pnpm

Environment Management: dotenv
