import express from 'express';
import db from '../db.js';
import {authenticateCompany} from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/',authenticateCompany, (req, res) => {
    const { location_id, sensor_name, sensor_category,sensor_type, sensor_meta } = req.body;
    const sensor_api_key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    if (!location_id || !sensor_name || !sensor_category || !sensor_meta || !sensor_api_key|| !sensor_type) {
        return res.status(400).json({ error: 'Location ID, sensor name, category, username y password son campos obligatorios' });
    }
   
    const stmt = db.prepare(`INSERT INTO sensor (location_id, sensor_name,sensor_category, sensor_type, sensor_meta, sensor_api_key) VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(location_id, sensor_name,sensor_category ,sensor_type, sensor_meta, sensor_api_key, (err) => {
        stmt.finalize();
        if (err) {
            return res.status(500).json({ error: 'Failed to create sensor', details: err.message });
        }
        res.status(201).json({ message: 'Sensor created successfully',sensor_api_key });
    });
    

});

router.get('/:id', authenticateCompany, (req, res) => {
    const sensorId = req.params.id;
    ;

    db.get(`SELECT * FROM sensor WHERE id = ?`, [sensorId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve sensor', details: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Sensor not found' });
        }
        res.status(200).json(row);
    });
});

router.get('/', authenticateCompany, (req, res) => {

    db.all(`SELECT * FROM sensor`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve sensors', details: err.message });
        }
        res.status(200).json(rows);
    });
});

router.put('/:id', authenticateCompany, (req, res) => {
    const sensorId = req.params.id;
    const { sensor_name, sensor_category,sensor_type, sensor_meta } = req.body;

    if (!sensor_name || !sensor_type || !sensor_meta || !sensor_category) {
        return res.status(400).json({ error: 'Sensor name, type, and meta are required' });
    }

    const stmt = db.prepare(`UPDATE sensor SET sensor_name = ?,sensor_category=?, sensor_type = ?, sensor_meta = ? WHERE sensor_id = ?`);
    stmt.run(sensor_name,sensor_category, sensor_type, sensor_meta, sensorId, (err) => {
        stmt.finalize();
        if (err) {
            return res.status(500).json({ error: 'Failed to update sensor', details: err.message });
        }
        res.status(200).json({ message: 'Sensor updated successfully' });
    });

});

router.delete('/:id', authenticateCompany, (req, res) => {
    const sensorId = req.params.id;

    const stmt = db.prepare(`DELETE FROM sensor WHERE id = ?`);
    stmt.run(sensorId, company_id, (err) => {
        stmt.finalize();
        if (err) {
            return res.status(500).json({ error: 'Failed to delete sensor', details: err.message });
        }
        res.status(200).json({ message: 'Sensor deleted successfully' });
    });
    
});

export default router;