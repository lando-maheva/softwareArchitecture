import express from 'express';

import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res)=>{ //this route will get all users from the db and send them back as json response
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json({users: users.rows});
        } catch (error) {
            res.status(500).json({error: error.message});
        
    }
})
export default router;
//this creates an express router that handles GET requests to the root path ('/). when a request is made to this path, 
// it queries the database for all users and sends them back as a json response. 
// if an error occurs during the process, it sends back a 500 status code along with the error message.

