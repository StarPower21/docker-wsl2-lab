-- 1. Creación de Tablas
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total NUMERIC(10, 2) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    CONSTRAINT fk_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS detalles_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- 2. Inserción Masiva de Datos (Seed de 100,000 registros por tabla)
-- Insertar 100,000 clientes
INSERT INTO clientes (nombre, email, fecha_registro)
SELECT 
    'Cliente ' || i AS nombre,
    'usuario' || i || '@correo.com' AS email,
    NOW() - (random() * INTERVAL '365 days') AS fecha_registro
FROM generate_series(1, 100000) AS i;

-- Insertar 100,000 pedidos relacionados uno a uno con los clientes creados
INSERT INTO pedidos (cliente_id, fecha_pedido, total, estado)
SELECT 
    i AS cliente_id,
    NOW() - (random() * INTERVAL '30 days') AS fecha_pedido,
    (random() * 500 + 10)::NUMERIC(10,2) AS total,
    (ARRAY['completado', 'pendiente', 'cancelado'])[floor(random() * 3 + 1)] AS estado
FROM generate_series(1, 100000) AS i;

-- Insertar 100,000 detalles de pedido asociados a los pedidos creados
INSERT INTO detalles_pedido (pedido_id, producto, cantidad, precio_unitario)
SELECT 
    i AS pedido_id,
    'Producto Catálogo #' || floor(random() * 1000 + 1) AS producto,
    floor(random() * 5 + 1)::INT AS cantidad,
    (random() * 100 + 5)::NUMERIC(10,2) AS precio_unitario
FROM generate_series(1, 100000) AS i;

-- Crear índices estratégicos para evaluar el comportamiento del planificador de consultas de la base de datos
CREATE INDEX idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX idx_detalles_pedido_id ON detalles_pedido(pedido_id);
