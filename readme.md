📁 Project Structure
text

root/
├── frontend/ # Frontend application
├── server/ # Backend API server
└── README.md
🛠️ Prerequisites
Before you begin, ensure you have the following installed:

Requirement Version
Node.js 22.21.1
pnpm Latest
🚀 Getting Started

1. Clone the Repository
   Bash

git clone <repository-url>
cd <project-folder> 2. Install Dependencies
Frontend:

Bash

cd frontend
pnpm install
Server:

Bash

cd server
pnpm install 3. Environment Configuration
Create a .env file in the server root directory:

env

PORT=9090
MONGOOSE_URL=<your-mongodb-connection-string>
MONGOOSE_PASSWORD=<your-database-password>
MONGOOSE_USER_NAME=<your-database-username>
SECRET_KEY=<your-secret-key>
ENVIRONMENT="development"
⚠️ Security Note: Never commit .env files to version control. Add .env to your .gitignore file.

4. Run the Application
   Start the server:

Bash

cd server
pnpm run dev
Start the frontend:

Bash

cd frontend
pnpm run dev
🌐 Application URLs
Service URL
Frontend http://localhost:1611
Server http://localhost:9090
📝 Environment Variables Reference
Variable Description
PORT Server port number
MONGOOSE_URL MongoDB connection string
MONGOOSE_PASSWORD MongoDB password
MONGOOSE_USER_NAME MongoDB username
SECRET_KEY JWT/encryption secret key
ENVIRONMENT App environment (development/production)
