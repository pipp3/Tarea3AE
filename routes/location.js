import express from 'express';
import db from '../db.js';
import {authenticateCompany} from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/',authenticateCompany,(req, res) => {
    const { location_name, location_country, location_city, location_meta } = req.body;
    const company_id = req.company_id;

    if (!company_id || !location_name || !location_country || !location_city || !location_meta) {
        return res.status(400).json({ error: 'company ID, location name, country, location_meta y city son datos requeridos' });
    }

    const stmt = db.prepare(`INSERT INTO location (company_id, location_name,location_country,location_city, location_meta) VALUES (?, ?, ?,?,?)`);
    stmt.run(company_id, location_name,location_country,location_country ,location_meta, (err) => {
        stmt.finalize();
        if (err) {
            return res.status(500).json({ error: 'Failed to create location', details: err.message });
        }
        res.status(201).json({ message: 'Location created successfully' });
    });
    
});

router.get('/:id', authenticateCompany, (req, res) => {
    const locationId = req.params.id;
    const company_id = req.company_id;

    db.get(`SELECT * FROM location WHERE id = ? AND company_id = ?`, [locationId, company_id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve location', details: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.status(200).json(row);
    });
});

router.get('/', authenticateCompany, (req, res) => {
    const company_id = req.company_id;

    db.all(`SELECT * FROM location WHERE company_id = ?`, [company_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve locations', details: err.message });
        }
        res.status(200).json(rows);
    });
});

router.put('/:id', authenticateCompany, (req, res) => {
    const locationId = req.params.id;
    const { location_name, location_country, location_city, location_meta  } = req.body;
    const company_id = req.company_id;

    if (!company_id || !location_name || !location_country || !location_city || !location_meta) {
        return res.status(400).json({ error: 'Location name and location meta are required' });
    }

    const stmt = db.prepare(`UPDATE location SET location_name = ?, location_country = ?, location_city = ?, location_meta = ? WHERE id = ? AND company_id = ?`);
    stmt.run(location_name, location_country, location_city, location_meta, locationId, company_id, (err) => {
        stmt.finalize();
        if (err) {
            return res.status(500).json({ error: 'Failed to update location', details: err.message });
        }
        res.status(200).json({ message: 'Location updated successfully' });
    });
});

router.delete('/:id', authenticateCompany, (req, res) => {
    const locationId = req.params.id;
    const company_id = req.company_id;

    const stmt = db.prepare(`DELETE FROM location WHERE id = ? AND company_id = ?`);
    stmt.run(locationId, company_id, (err) => {
        stmt.finalize();
        if (err) {
            return res.status(500).json({ error: 'Failed to delete location', details: err.message });
        }
        res.status(200).json({ message: 'Location deleted successfully' });
    });
});
export default router;