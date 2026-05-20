const express = require('express');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
    user: 'admin',
    host: 'postgres',
    database: 'laboratorio',
    password: 'admin123',
    port: 5432,
});

app.get('/', (req, res) => {
    res.send('Servidor Node.js funcionando correctamente');
});

app.get('/api/estudiantes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM estudiantes');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error conectando con PostgreSQL'
        });
    }
});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en puerto 3000');
});
