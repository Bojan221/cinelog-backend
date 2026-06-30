const express = require('express');
require('dotenv').config();
const db = require('./config/db');

const port = process.env.PORT || 5000;

const app = express();


app.use(express.json())

app.get('/', async (req,res) => {
    try{
        const [rows] = await db.query('SELECT * FROM users')
        res.status(200).json(rows)
    } catch(err) { 
        console.log(err)
    }
})

app.listen(port, async () => {
    try { 
        await db.query('SELECT 1');
        console.log("Database connected successfully!")
    }catch { 
        console.log('Error connecting to database')
    }
    console.log(`Server is running on port ${port}`)
})