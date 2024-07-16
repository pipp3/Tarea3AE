import db from '../db.js';

const authenticateCompany = (req, res, next) => {
    const { company_api_key } = req.headers;
    if (!company_api_key) {
        return res.status(400).json({ error: 'Company API key is required' });
    }

    db.get(`SELECT id FROM company WHERE company_api_key = ?`, [company_api_key], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate company', details: err.message });
        }
        if (!row) {
            return res.status(401).json({ error: 'Invalid company API key' });
        }

        req.company_id = row.id;
        next();
    });
};

const authenticateSensor = (req, res, next) => {
    const sensorApiKey = req.headers['sensor_api_key'];

    if (!sensorApiKey) {
        return res.status(401).json({ error: 'Sensor API key is required' });
    }

    db.get('SELECT sensor_id FROM sensor WHERE sensor_api_key = ?', [sensorApiKey], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error', details: err.message });
        }
        if (!row) {
            return res.status(401).json({ error: 'Invalid sensor API key' });
        }

        req.sensor_id = row.sensor_id;
        next();
    });
};

export {authenticateCompany,authenticateSensor};
