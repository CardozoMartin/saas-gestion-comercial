create database sistema_de_ventas;

use sistema_de_ventas;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) UNIQUE NOT NULL, -- 'admin', 'vendedor'
    descripcion TEXT
);

CREATE TABLE usuarios_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    rol_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    UNIQUE KEY (usuario_id, rol_id)
);

CREATE TABLE unidades_medida (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) UNIQUE NOT NULL, -- 'unidad', 'kg', 'gramo', 'litro', 'metro'
    abreviatura VARCHAR(10) NOT NULL
);

CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria_id INT,
    precio_costo DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    unidad_medida_id INT NOT NULL,
    stock_minimo DECIMAL(10,3) DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (unidad_medida_id) REFERENCES unidades_medida(id)
);

-- Tabla para conversiones de unidades (ej: 1 kg = 1000 gramos)
CREATE TABLE productos_unidades_venta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    unidad_medida_id INT NOT NULL,
    factor_conversion DECIMAL(10,4) NOT NULL, -- Factor para convertir a la unidad base
    precio_venta DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (unidad_medida_id) REFERENCES unidades_medida(id),
    UNIQUE KEY (producto_id, unidad_medida_id)
);

ALTER TABLE productos 
ADD COLUMN fraccionable BOOLEAN DEFAULT FALSE AFTER unidad_medida_id;

CREATE TABLE movimientos_stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    tipo_movimiento ENUM('entrada', 'salida', 'ajuste') NOT NULL,
    cantidad DECIMAL(10,3) NOT NULL,
    motivo VARCHAR(200),
    usuario_id INT NOT NULL,
    referencia_id INT, -- ID de venta, compra, etc.
    referencia_tipo VARCHAR(50), -- 'venta', 'compra', 'ajuste_manual'
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE stock_actual (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT UNIQUE NOT NULL,
    cantidad DECIMAL(10,3) NOT NULL DEFAULT 0,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_documento ENUM('DNI', 'CUIT', 'CUIL', 'Pasaporte') NOT NULL,
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    razon_social VARCHAR(200),
    email VARCHAR(150),
    telefono VARCHAR(20),
    direccion TEXT,
    limite_credito DECIMAL(10,2) DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE condiciones_pago (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) UNIQUE NOT NULL, -- 'semanal', 'quincenal', 'mensual'
    dias INT NOT NULL -- 7, 15, 30
);

CREATE TABLE cuentas_corrientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT UNIQUE NOT NULL,
    saldo_actual DECIMAL(10,2) DEFAULT 0,
    condicion_pago_id INT,
    fecha_proximo_vencimiento DATE,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (condicion_pago_id) REFERENCES condiciones_pago(id)
);

CREATE TABLE ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_venta VARCHAR(20) UNIQUE NOT NULL,
    cliente_id INT,
    usuario_id INT NOT NULL,
    tipo_venta ENUM('contado', 'cuenta_corriente', 'transferencia') NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'pagada', 'cancelada') DEFAULT 'pendiente',
    observaciones TEXT,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (usuario_id) REFERENCIAS usuarios(id)
);

CREATE TABLE ventas_detalle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    unidad_medida_id INT NOT NULL,
    cantidad DECIMAL(10,3) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (unidad_medida_id) REFERENCES unidades_medida(id)
);

CREATE TABLE medios_pago (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) UNIQUE NOT NULL, -- 'efectivo', 'transferencia', 'tarjeta_debito', 'tarjeta_credito'
    requiere_referencia BOOLEAN DEFAULT FALSE
);

CREATE TABLE pagos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venta_id INT,
    cliente_id INT, -- Para pagos de cuenta corriente sin venta específica
    medio_pago_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    referencia VARCHAR(100), -- Número de transferencia, etc.
    usuario_id INT NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (medio_pago_id) REFERENCES medios_pago(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE movimientos_cuenta_corriente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cuenta_corriente_id INT NOT NULL,
    tipo_movimiento ENUM('cargo', 'pago') NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    saldo_anterior DECIMAL(10,2) NOT NULL,
    saldo_nuevo DECIMAL(10,2) NOT NULL,
    venta_id INT,
    pago_id INT,
    descripcion TEXT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cuenta_corriente_id) REFERENCES cuentas_corrientes(id),
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (pago_id) REFERENCES pagos(id)
);
CREATE TABLE cajas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    monto_inicial DECIMAL(10,2) NOT NULL,
    monto_final DECIMAL(10,2),
    total_efectivo DECIMAL(10,2),
    total_transferencias DECIMAL(10,2),
    total_ventas DECIMAL(10,2),
    diferencia DECIMAL(10,2), -- Diferencia entre esperado y real
    estado ENUM('abierta', 'cerrada') DEFAULT 'abierta',
    observaciones TEXT,
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE cajas_movimientos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    caja_id INT NOT NULL,
    pago_id INT,
    tipo_movimiento ENUM('venta', 'retiro', 'ingreso') NOT NULL,
    medio_pago_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caja_id) REFERENCES cajas(id),
    FOREIGN KEY (pago_id) REFERENCES pagos(id),
    FOREIGN KEY (medio_pago_id) REFERENCES medios_pago(id)
);

CREATE TABLE auditoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    accion VARCHAR(100) NOT NULL, -- 'crear_venta', 'modificar_producto', 'cerrar_caja', etc.
    tabla_afectada VARCHAR(50) NOT NULL,
    registro_id INT,
    datos_anteriores JSON,
    datos_nuevos JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_usuario_fecha (usuario_id, fecha_accion),
    INDEX idx_tabla_registro (tabla_afectada, registro_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_ventas_usuario ON ventas(usuario_id);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);
CREATE INDEX idx_movimientos_stock_producto ON movimientos_stock(producto_id);
CREATE INDEX idx_movimientos_stock_fecha ON movimientos_stock(fecha_movimiento);
CREATE INDEX idx_clientes_activo ON clientes(activo);
CREATE INDEX idx_cajas_usuario_estado ON cajas(usuario_id, estado);