# 🧠 User Note – Backend

## 🚀 Backend Setup Instructions

Follow these steps to set up and run the backend server locally:

---

### Requirements

1. NVM 0.38.0
2. Node 24.2.0
3. NPM 11.4.2

### 📁 1. Clone the Repository

```
git clone git@github.com:naveenm666/user_notes_backend.git
cd user_notes_backend
npm install
```

### CROSS-PLATFORM SETUP
add these in your '.env' file
```
PORT=portnumber
NODE_ENV=development
FRONTEND_URL=http://localhost:port
```
### 📁 **2. Database Setup**

- Create a `.env` file in the root of the project directory.
- Add the following environment variables** to the `.env` file:

```
DB_HOST=localhost
DB_PORT=port
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=mentor_ai_development
JWT_SECRET=your_jwt_secret_key
```
**Note:** Create `user_notes_development` database in your local MySQL instance

```
mysql -u <YOUR_USERNAME> -p

create database user_notes_development;
```

#### Steps to Generate JWT Secret
To generate the JWT secret, run the following command in your terminal:

```
openssl rand -hex 32
```

### 📁 3. **Migrations**
Run the following commands to set up your database schema:

```bash

# Run migrations
npm run migration:run

(NOTE: Frontend team should avoid this command)
# Revert migrations
npm run migration:revert

(NOTE: Frontend team should avoid this command)
# Generate migration
npm run migration:generate
```
### 📁 5. Start Server

```bash
npm run dev
```