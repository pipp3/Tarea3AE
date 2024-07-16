import express from 'express';
import bodyParser from 'body-parser';
import adminRoutes from './routes/admin.js';
import companyRoutes from './routes/company.js';
import locationRoutes from './routes/location.js';
import sensorRoutes from './routes/sensor.js';
import sensorDataRoutes from './routes/sensor_data.js';

const app = express();
const port = 3000; // Puedes cambiar el puerto si lo deseas
app.use(bodyParser.json());



app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/api/v1/sensor', sensorRoutes);
app.use('/api/v1/sensor_data', sensorDataRoutes);


app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});

