import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  try {
    const batchSize = 1000;
    const timestamp = new Date().toISOString();
    
    // Ejecutamos inserciones concurrentes individuales en un bucle
    for (let i = 0; i < batchSize; i++) {
      await pool.query(
        'INSERT INTO clientes (nombre, email, fecha_registro) VALUES ($1, $2, $3)',
        [`Cliente Stress ${i}`, `stress_${i}_${Date.now()}@test.com`, timestamp]
      );
    }

    res.status(200).json({ 
      success: true, 
      inserted: batchSize,
      message: "Escritura masiva completada en la base de datos." 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
