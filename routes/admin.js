import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/', (req, res) => {
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({message: 'Faltan datos'});
    }
    const stmt = db.prepare(`INSERT INTO admin (username, password) VALUES (?, ?)`);
    stmt.run(username, password, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear el Admin' });
        }
        res.status(201).json({ message: 'Admin creado con exito' });
    });
    stmt.finalize();
});

export default router;