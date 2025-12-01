# Quick Start Guide - Fixing the Crash

## The Problem
Your server is crashing because **PostgreSQL is not running**.

## Solution Steps

### Step 1: Start PostgreSQL

**Option A: Using Windows Services (Easiest)**
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find services named like:
   - `postgresql-x64-15` (or similar version number)
   - `PostgreSQL Database Server`
4. Right-click → **Start**
5. Wait for status to change to "Running"

**Option B: Using pgAdmin**
1. Open **pgAdmin 4** from Start Menu
2. Connect to your server (this may auto-start PostgreSQL)

**Option C: Command Line**
```powershell
# Find your PostgreSQL version first, then:
& "C:\Program Files\PostgreSQL\15\bin\pg_ctl.exe" start -D "C:\Program Files\PostgreSQL\15\data"
```
*(Replace `15` with your PostgreSQL version number)*

### Step 2: Verify PostgreSQL is Running

Run this command:
```powershell
Test-NetConnection -ComputerName localhost -Port 5432
```

You should see: `TcpTestSucceeded : True`

### Step 3: Update .env File

Make sure your `.env` file has:
```
PORT=3000
PASSWORD=your_actual_postgres_password
```

**Important:** Replace `123` with the password you used when installing PostgreSQL.

### Step 4: Verify Database Schema

1. Open **pgAdmin 4**
2. Connect to your PostgreSQL server
3. Navigate to: **Databases** → **postgres** → **Schemas**
4. Check if `FoodTruck` schema exists
5. If not, create it:
   - Right-click **Schemas** → **Create** → **Schema**
   - Name: `FoodTruck`
   - Click **Save**
6. Run the SQL script:
   - Right-click on `FoodTruck` schema → **Query Tool**
   - Open `connectors/scripts.sql`
   - Copy all content and paste into Query Tool
   - Click **Execute** (F5)

### Step 5: Start Your Server

```bash
npm run server
```

You should now see:
```
✅ Database connection successful
Server is now listening at port 3000 on http://localhost:3000/
```

## If It Still Crashes

1. **Check PostgreSQL password:**
   - Open pgAdmin
   - Try connecting with the password in your `.env`
   - If it fails, update `.env` with the correct password

2. **Check if schema exists:**
   - In pgAdmin, verify `FoodTruck` schema is created
   - Verify tables exist (Users, Sessions, Trucks, etc.)

3. **Check PostgreSQL logs:**
   - Usually in: `C:\Program Files\PostgreSQL\15\data\log\`

## Quick Test

Once server is running, test it:
```bash
# In a new terminal
curl http://localhost:3000/test
```

Or open `test-api.html` in your browser!

