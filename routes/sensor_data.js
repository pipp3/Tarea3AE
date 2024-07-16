import express from 'express';
import db from '../db.js';
import {authenticateSensor} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateSensor, (req, res) => {
    const { data } = req.body;
    const sensor_id = req.sensor_id;
    const timestamp = Math.floor(Date.now() / 1000); // EPOCH timestamp en segundos

    if (!data) {
        return res.status(400).json({ error: 'Sensor data is required' });
    }

    const stmt = db.prepare(`INSERT INTO sensor_data (sensor_id, data, timestamp) VALUES (?, ?, ?)`);
    stmt.run(sensor_id, JSON.stringify(data), timestamp, (err) => {
        stmt.finalize();
        if (err) {
            return res.status(500).json({ error: 'Failed to store sensor data', details: err.message });
        }
        res.status(201).json({ message: 'Sensor data stored successfully' });
    });
});

router.get('/', authenticateSensor, (req, res) => {
    const { from, to, sensor_id } = req.query;

    if (!from || !to || !sensor_id) {
        return res.status(400).json({ error: 'Parameters from, to, and sensor_id are required' });
    }

    const sensorIds = sensor_id.split(',').map(id => parseInt(id.trim()));

    // Prepare the query with placeholders for sensor_ids
    const query = `
        SELECT * FROM sensor_data 
        WHERE timestamp BETWEEN ? AND ?
        AND sensor_id IN (${sensorIds.map(() => '?').join(',')})
    `;

    // Prepare parameters for the query
    const params = [from, to, ...sensorIds];

    // Execute the query
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve sensor data', details: err.message });
        }
        res.status(200).json(rows);
    });
});

export default router;

