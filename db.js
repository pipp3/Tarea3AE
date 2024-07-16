// database.js
import sqlite3 from "sqlite3";
const { Database } = sqlite3;
const db = new Database("iot3");

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS admin (
        username TEXT PRIMARY KEY,
        password TEXT
    )`,
    (err) => {
      if (err) {
        console.error("Error al crear la tabla", err);
      } else {
        console.log("Tabla creada con exito");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS company (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT,
        company_api_key TEXT
    )`,
    (err) => {
      if (err) {
        console.error("Error al crear la tabla", err);
      } else {
        console.log("Tabla creada con exito");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS location (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_id INTEGER,
            location_name TEXT,
            location_country TEXT,
            location_city TEXT,
            location_meta TEXT,
            FOREIGN KEY (company_id) REFERENCES company (id)
        )`,
    (err) => {
      if (err) {
        console.error("Error al crear la tabla", err);
      } else {
        console.log("Tabla creada con exito");
      }
    }
  );
  // Crear tabla Sensor
  db.run(
    `CREATE TABLE IF NOT EXISTS sensor (
        sensor_id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_id INTEGER,
        sensor_name TEXT,
        sensor_category TEXT,
        sensor_type TEXT,
        sensor_meta TEXT,
        sensor_api_key TEXT,
        FOREIGN KEY (location_id) REFERENCES location (id)
    )`,
    (err) => {
      if (err) {
        console.error("Error al crear la tabla", err);
      } else {
        console.log("Tabla creada con exito");
      }
    }
  );

  db.run(`
    CREATE TABLE IF NOT EXISTS sensor_data (
        data_id INTEGER PRIMARY KEY AUTOINCREMENT,
        sensor_id INTEGER NOT NULL,
        data TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY(sensor_id) REFERENCES sensor(sensor_id)
    )
`);

});

export default db;
