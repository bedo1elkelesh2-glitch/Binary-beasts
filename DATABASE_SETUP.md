# Database Setup Guide for pgAdmin

## ✅ Step 1: Connect to PostgreSQL in pgAdmin

1. **Open pgAdmin 4** from your Start Menu
2. **Enter your master password** (the one you set during pgAdmin installation)
3. In the left sidebar, you should see **Servers**
4. **Expand Servers** → You'll see your PostgreSQL server (usually named "PostgreSQL 18" or similar)
5. **Click on the server** → It will ask for the PostgreSQL password
   - Enter the password you set during PostgreSQL installation
   - Check "Save password" if you want
   - Click **OK**

## ✅ Step 2: Create the FoodTruck Schema

1. In the left sidebar, expand your server
2. Expand **Databases** → **postgres** → **Schemas**
3. **Right-click on "Schemas"** → **Create** → **Schema...**
4. In the **General** tab:
   - **Name:** `FoodTruck` (case-sensitive, must match exactly)
5. Click **Save**

## ✅ Step 3: Create All Tables

1. In pgAdmin, navigate to: **Servers** → **[Your Server]** → **Databases** → **postgres** → **Schemas** → **FoodTruck**
2. **Right-click on "FoodTruck" schema** → **Query Tool**
3. **Open the file:** `connectors/scripts.sql` in your project
4. **Copy ALL the content** from `scripts.sql`
5. **Paste it into the Query Tool** in pgAdmin
6. Click the **Execute** button (or press **F5**)
7. You should see: **"Query returned successfully"** at the bottom

## ✅ Step 4: Verify Tables Were Created

1. In pgAdmin, expand: **Schemas** → **FoodTruck** → **Tables**
2. You should see these tables:
   - ✅ Carts
   - ✅ MenuItems
   - ✅ OrderItems
   - ✅ Orders
   - ✅ Sessions
   - ✅ Trucks
   - ✅ Users

## ✅ Step 5: Update .env File

1. Open `.env` file in your project root
2. Make sure it has:
   ```
   PORT=3000
   PASSWORD=your_postgres_password
   ```
3. **Important:** Replace `your_postgres_password` with the actual password you use to connect to PostgreSQL in pgAdmin

## ✅ Step 6: Test the Server

1. Start your server:
   ```bash
   npm run server
   ```

2. You should see:
   ```
   ✅ Database connection successful
   Server is now listening at port 3000 on http://localhost:3000/
   ```

3. If you see the success message, you're all set! 🎉

## Troubleshooting

### "password authentication failed"
- Check your `.env` file has the correct PostgreSQL password
- The password should match what you use in pgAdmin

### "schema 'FoodTruck' does not exist"
- Make sure you created the schema (Step 2)
- The name must be exactly `FoodTruck` (case-sensitive)

### "relation 'FoodTruck.Users' does not exist"
- Make sure you ran the `scripts.sql` file (Step 3)
- Check that tables exist in pgAdmin (Step 4)

### Still getting connection errors?
- Verify PostgreSQL service is running: `Get-Service postgresql-x64-18`
- Test connection: `Test-NetConnection -ComputerName localhost -Port 5432`

