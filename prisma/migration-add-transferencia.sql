-- Migración para agregar 'transferencia' al enum tipo_venta
-- Fecha: 2026-01-11

USE sistema_de_ventas;

-- Modificar la columna tipo_venta para incluir 'transferencia'
ALTER TABLE ventas 
MODIFY COLUMN tipo_venta ENUM('contado', 'cuenta_corriente', 'transferencia') NOT NULL;

-- Verificar el cambio
DESCRIBE ventas;
