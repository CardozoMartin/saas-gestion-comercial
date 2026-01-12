use sistema_de_ventas;

INSERT INTO roles (nombre, descripcion) VALUES
('admin', 'Administrador del sistema con acceso completo'),
('vendedor', 'Vendedor con acceso a ventas y consultas'),
('cajero', 'Encargado de caja y cobros');

INSERT INTO unidades_medida (nombre, abreviatura) VALUES
('Unidad', 'un'),
('Kilogramo', 'kg'),
('Gramo', 'g'),
('Litro', 'l'),
('Mililitro', 'ml'),
('Metro', 'm'),
('Centímetro', 'cm'),
('Caja', 'cja'),
('Paquete', 'pqt'),
('Docena', 'doc');

INSERT INTO categorias (nombre, descripcion) VALUES
('Almacén', 'Productos de almacén y despensa'),
('Bebidas', 'Bebidas alcohólicas y no alcohólicas'),
('Lácteos', 'Productos lácteos y derivados'),
('Carnes', 'Carnes rojas, blancas y embutidos'),
('Frutas y Verduras', 'Productos frescos de huerta'),
('Panadería', 'Pan, facturas y productos de panadería'),
('Limpieza', 'Productos de limpieza e higiene'),
('Snacks', 'Golosinas, galletitas y snacks'),
('Congelados', 'Productos congelados'),
('Perfumería', 'Artículos de cuidado personal');

INSERT INTO condiciones_pago (nombre, dias) VALUES
('Semanal', 7),
('Quincenal', 15),
('Mensual', 30),
('Bimestral', 60);

INSERT INTO medios_pago (nombre, requiere_referencia) VALUES
('Efectivo', FALSE),
('Transferencia', TRUE),
('Tarjeta Débito', TRUE),
('Tarjeta Crédito', TRUE),
('MercadoPago', TRUE),
('Cheque', TRUE);

ALTER TABLE clientes 
MODIFY COLUMN nombre VARCHAR(100) NULL,
MODIFY COLUMN apellido VARCHAR(100) NULL;

INSERT INTO clientes (tipo_documento, numero_documento, nombre, apellido, razon_social, email, telefono, direccion, limite_credito, activo) VALUES
('DNI', '12345678', 'Roberto', 'Sánchez', NULL, 'roberto.sanchez@email.com', '3815123456', 'Av. Mate de Luna 1234', 50000.00, TRUE),
('DNI', '23456789', 'Laura', 'Fernández', NULL, 'laura.fernandez@email.com', '3815234567', 'San Martín 567', 30000.00, TRUE),
('CUIT', '20-30123456-7', NULL, NULL, 'Almacén Don Pedro SA', 'ventas@donpedro.com', '3815345678', 'Congreso 890', 100000.00, TRUE),
('DNI', '34567890', 'Martín', 'López', NULL, 'martin.lopez@email.com', '3815456789', 'Independencia 234', 20000.00, TRUE),
('CUIT', '23-30234567-9', NULL, NULL, 'Distribuidora El Sol SRL', 'contacto@elsol.com', '3815567890', 'Ruta 9 Km 1280', 150000.00, TRUE),
('DNI', '45678901', 'Sofía', 'Ramírez', NULL, NULL, '3815678901', 'Las Heras 456', 0.00, TRUE),
('DNI', '56789012', 'Diego', 'Torres', NULL, 'diego.torres@email.com', '3815789012', '25 de Mayo 789', 40000.00, TRUE),
('CUIL', '27-28123456-3', 'Patricia', 'Gómez', NULL, 'patricia.gomez@email.com', '3815890123', 'Laprida 123', 25000.00, TRUE);