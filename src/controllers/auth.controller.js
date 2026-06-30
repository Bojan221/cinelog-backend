const db = require('../config/db');
const bcrypt = require('bcrypt');

const registerUser = async (req,res) => { 
    try { 
        const {firstName, lastName, username, password,terms,email} = req.body;
        const salt = 10;
        
        const hashedPassword = await bcrypt.hash(password, salt);
        const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
        const [rows] = await db.query(query,[email,username])
        
        if(rows.length > 0) { 
            return res.status(400).json({message:"The user with this email or user name already exists."})
        }

        const insertQuery = 'INSERT INTO users (email, password, username, first_name, last_name) VALUES(?,?,?,?,?)'

        const [result] = await db.query(insertQuery, [email,hashedPassword,username,firstName,lastName])
        console.log(result)
    } catch(err) { 
        console.log('ne radi')
    }
}


module.exports = {registerUser}