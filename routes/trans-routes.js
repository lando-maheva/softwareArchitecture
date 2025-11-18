import express from 'express';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();



//route to get all transactions endpoints
// get all transactions 


router.post('/', async (req, res) => {
    let connection;
    
   
    const { card_id, amount, status } = req.body; 

   
    const newTransactionId = uuidv4(); 
    
   
    if (!card_id || amount === undefined || !status) {
        
        return res.status(400).json({ 
            message: 'Missing required transaction fields (card_id, amount, or status).'
        });
    }

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        
        const sql = `
            INSERT INTO transactions 
            (transactions_id, card_id, amount, status, timestamp) 
            VALUES (?, ?, ?, ?, NOW())
        `;
        
        
        const [result] = await connection.execute(
            sql, 
            [newTransactionId, card_id, amount, status] 
        );
        
        await connection.commit();
        
        
        res.status(201).json({ 
            message: 'Transaction created successfully.',
            transactionId: newTransactionId 
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Transaction failed:', error);
        
        res.status(500).json({ message: 'Transaction failed due to a server error.' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});
// view a single transaction

router.get('/:transactionId', async (req, res) => {
    const { transactionId } = req.params;

    if (!transactionId) {
        return res.status(400).json({ message: 'Transaction ID is required.' });
    }

    try {
        const sql = `
            SELECT 
                transactions_id, card_id, amount, cardholder_name, status, timestamp 
            FROM transactions 
            WHERE transactions_id = ?
        `;
        
        const [transactions] = await pool.execute(sql, [transactionId]);

        if (transactions.length === 0) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        //returning a single transaction object 
        res.status(200).json(transactions[0]); 

    } catch (error) {
        console.error('Error fetching single transaction:', error);
        res.status(500).json({ message: 'Failed to retrieve transaction.' });
    }
});
// delete a transaction

router.delete('/:transactionId', async (req, res) => {
    const { transactionId } = req.params;

    if (!transactionId) {
        return res.status(400).json({ message: 'Transaction ID is required.' });
    }

    try {
        const sql = `DELETE FROM transactions WHERE transactions_id = ?`;
        
        const [result] = await pool.execute(sql, [transactionId]);

        // check if any row was affected
        if (result.affectedRows === 0) {
            
            return res.status(404).json({ message: 'Transaction not found or already deleted.' });
        }

        // Return 204 no content for a successful deletion
        res.status(204); 

    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Failed to delete transaction.' });
    }
});

export default router;