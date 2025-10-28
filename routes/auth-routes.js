import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { authenticationToken } from '../middleware/authentication.js';

const router = express.Router();

//Get all users

router.get('/',authenticationToken, async (req, res)=>{
    try{
        const [results] = await pool.query('SELECT * FROM users'); // Use destructuring to get rows
        // we want to pass all this infor in users as json objects
        res.json({results:results}); // Assuming 'results' is now the array of rows
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
        
        // Retrieve the new  user using the inserted ID
        // pool.query will returns [rows, fields].
       
        const [newUserRows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [newUserId]);
            
        // Check if the user was successfully retrieved after insertion
        if (newUserRows && newUserRows.length > 0) {
            // Success response: 201(OK) Created
            return res.status(201).json({
                message: 'User created successfully',
                user: newUserRows[0]
            });
        }
        
        //  if the retrieval failed after a successful insertion
        res.status(500).json({ error: 'User registration failed ' });

    } catch (error) {
        res.status(500).json({error:error.message});
        
    }

})
// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // Find user by email
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Authentication failed. Invalid email or password.' });
        }

        const user = rows[0];

        // lets COMPARE the provided password with the hashed password in the database
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Authentication failed. Invalid email or password.' });
        }
        
        // Authentication successful
       
        res.json({ 
            message: 'Login successful', 
            user: { user_id: user.user_id, email: user.email, firstname: user.firstname } 
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});


export default router;
//this creates an express router that handles GET requests to the root path ('/). when a request is made to this path, 
// it queries the database for all users and sends them back as a json response. 
// if an error occurs during the process, it sends back a 500 status code along with the error message.
