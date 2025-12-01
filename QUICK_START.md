# 🚀 Quick Start Guide

## Prerequisites ✅
- [x] PostgreSQL installed and running
- [x] pgAdmin installed
- [x] Node.js and npm installed

## Setup Steps (5 minutes)

### 1. Set Up Database in pgAdmin

**Open pgAdmin and follow these steps:**

1. **Connect to PostgreSQL:**
   - Open pgAdmin 4
   - Connect to your PostgreSQL server (enter your password)

2. **Create Schema:**
   - Navigate: **Databases** → **postgres** → **Schemas**
   - Right-click **Schemas** → **Create** → **Schema**
   - Name: `FoodTruck`
   - Click **Save**

3. **Create Tables:**
   - Right-click **FoodTruck** schema → **Query Tool**
   - Open `connectors/scripts.sql` from your project
   - Copy ALL content and paste into Query Tool
   - Click **Execute** (F5)

### 2. Configure Environment

**Update `.env` file:**
```
PORT=3000
PASSWORD=your_postgres_password
```
*(Replace with your actual PostgreSQL password)*

### 3. Start the Server

```bash
npm run server
```

**Expected output:**
```
✅ Database connection successful
Server is now listening at port 3000 on http://localhost:3000/
```

### 4. Test the API

**Option A: Use the HTML test page**
- Open `test-api.html` in your browser
- Test all endpoints with the UI

**Option B: Use the test script**
```bash
node test-endpoints.js
```

**Option C: Use Thunder Client/Postman**
- See `TESTING_GUIDE.md` for details

## Available Endpoints

### Public Endpoints
- `POST /api/v1/user` - Register new user
- `POST /api/v1/user/login` - Login

### Private Endpoints (require login)
- `GET /test` - Test authenticated endpoint

## Need Help?

- **Database setup issues?** → See `DATABASE_SETUP.md`
- **Testing endpoints?** → See `TESTING_GUIDE.md`
- **Server won't start?** → Check PostgreSQL is running

