// import the knex library that will allow us to
// construct SQL statements
const knex = require('knex');
require('dotenv').config();

const config = {
  client: 'pg',
  connection: {
    host : 'localhost',
    port : 5432,
    user : 'postgres',
    password : process.env.PASSWORD,
    database : 'postgres'
  }
};

const db = knex(config);

// Test database connection on startup
db.raw('SELECT 1')
  .then(() => {
    console.log('✅ Database connection successful');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    console.error('\n⚠️  Please ensure:');
    console.error('   1. PostgreSQL is running');
    console.error('   2. Database credentials in .env are correct');
    console.error('   3. The FoodTruck schema exists in the database');
    console.error('\nThe server will continue, but database operations will fail.');
  });

// expose the created connection so we can
// use it in other files to make sql statements
module.exports = db;