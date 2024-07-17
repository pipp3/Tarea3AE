import express from 'express';
import db from '../db.js';
import {authenticateCompany} from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', (req, res) => {
    const {username,password,company_name} = req.body;
    if (!username || !password || !company_name) {
        return res.status(400).json({ error: 'User, password, company name son campos obligatorios' });
    }

    db.get(`SELECT * FROM admin WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate admin', details: err.message });
        }
        if (!row) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
    
        const company_api_key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const stmt = db.prepare(`INSERT INTO company (company_name, company_api_key) VALUES (?, ?)`);
        stmt.run(company_name, company_api_key, (err) => {
            stmt.finalize();
            if (err) {
                return res.status(500).json({ error: 'Error al crear la empresa' });
            }
            res.status(201).json({ message: 'Empresa creada con exito, api key para company:', company_api_key });
        });
        
    });
});

router.get('/:id', authenticateCompany,(req, res) => {
    const company_id = req.params.id;
    db.get(`SELECT * FROM company WHERE id = ?`, [company_id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la empresa' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Empresa no encontrada' });
        }
        res.json(row);
    });

    db.all(`SELECT * FROM company`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener las empresas' });
        }
        res.json(rows);
    });
});

router.get('/', authenticateCompany, (req, res) => {
    db.all(`SELECT * FROM company`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve companies', details: err.message });
        }
        res.status(200).json(rows);
    });
});

router.put('/:id', authenticateCompany, (req, res) => {
    const companyId = req.params.id;
    const { company_name } = req.body;

    if (!company_name) {
        return res.status(400).json({ error: 'Company name and API key are required' });
    }

    const stmt = db.prepare(`UPDATE company SET company_name = ? WHERE id = ?`);
    stmt.run(company_name, companyId, (err) => {
        stmt.finalize();
        if (err) {
            return res.status(500).json({ error: 'Failed to update company', details: err.message });
            
        }
        res.status(200).json({ message: 'Company updated successfully' });
    });
    
});

router.delete('/:id', authenticateCompany, (req, res) => {
    const companyId = req.params.id;

    const stmt = db.prepare(`DELETE FROM company WHERE id = ?`);
    stmt.run(companyId, (err) => {
        stmt.finalize();
        if (err) {
            return res.status(500).json({ error: 'Failed to delete company', details: err.message });
        }
        res.status(200).json({ message: 'Company deleted successfully' });
    });
    
});

export default router;