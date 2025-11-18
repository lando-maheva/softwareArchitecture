import express from 'express';
import pool from '../db.js';


const router = express.Router();


//route to get all transactions endpoints
// get all transactions 

router.post('/', async(req,res)=>{
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        //get all transactions from a specific card user
        const [results] = await connection.query('SELECT* FROM transactions WHERE card_id = ?',[req.body.connectionId]);
        res.status(201).json({ message: 'Transaction created successfully.' });
        await connection.commit()
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Transaction failed:', error);
        res.status(500).json({ message: 'Transaction failed due to a server error.' });
    }
})

export default router;