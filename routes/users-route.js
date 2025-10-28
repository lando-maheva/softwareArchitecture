import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { authenticationToken } from '../middleware/authentication.js';

const router = express.Router();

//Get all users

router.get('/',authenticationToken, async (req, res)=>{
    try{
        const [results] = await pool.query('SELECT * FROM users');
        // we want to pass all this infor in users as json objects
        res.json({results:results}); 
    }catch(error){
        res.status(500).json({error:error.message});
    }
})

// to be able to create a user we need to send a post request 
router.post('/', async (req,res)=>{
    try {
        // we need to hash the password before storing it in the database 
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        
        //we want to create a new user
        
        const [insertResult] = await pool.query(
            'INSERT INTO users(firstname,lastname,email,DOB,password) VALUES(?,?,?,?,?)',
            [req.body.firstname,req.body.lastname, req.body.email,req.body.DOB, hashedPassword]
        );
            
        const newUserId = insertResult.insertId;
        
        // let's Retrieve the newly created user using the inserted ID
        // pool.query returns [rows, fields]. 
        const [newUserRows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [newUserId]);
            
        // Check if the user was successfully retrieved after insertion
        if (newUserRows && newUserRows.length > 0) {
            // Success response: 201(ok) Created
            return res.status(201).json({
                message: 'User created successfully',
                user: newUserRows[0]
            });
        }
    } catch (error) {
        res.status(500).json({error:error.message});
        
    }

})

export default router;
//this creates an express router that handles GET requests to the root path ('/). when a request is made to this path, 
// it queries the database for all users and sends them back as a json response. 
// if an error occurs during the process, it sends back a 500 status code along with the error message.
