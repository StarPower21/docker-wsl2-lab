import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  try {
    // Forzamos un JOIN masivo sin paginación para obligar al SO a asignar memoria a lo loco
    const queryText = `
      SELECT c.nombre, c.email, p.total, p.estado, d.producto, d.cantidad, d.precio_unitario
      FROM clientes c
      INNER JOIN pedidos p ON c.id = p.cliente_id
      INNER JOIN detalles_pedido d ON p.id = d.pedido_id
      ORDER BY p.total DESC, c.nombre ASC
      LIMIT 80000;
    `;

    const result = await pool.query(queryText);

    res.status(200).json({ 
      success: true, 
      recordsRetrieved: result.rows.length,
      message: "Consulta pesada completada con éxito."
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
