# Sistema de Gestión de Cajas

## Descripción General

El sistema de cajas permite controlar el dinero en efectivo y transferencias de cada usuario vendedor. Cada usuario debe abrir una caja al iniciar su jornada y cerrarla al finalizar, registrando automáticamente todas las ventas realizadas.

## Flujo de Trabajo

### 1. Abrir Caja (Inicio de Jornada)

**Endpoint:** `POST /api/v1/cajas/abrir`

**Body:**
```json
{
  "usuarioId": 1,
  "montoInicial": 1000.00,
  "observaciones": "Caja inicial del día"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Caja abierta exitosamente",
  "data": {
    "id": 1,
    "usuarioId": 1,
    "montoInicial": 1000.00,
    "estado": "abierta",
    "fechaApertura": "2026-01-11T08:00:00.000Z"
  }
}
```

**Validaciones:**
- Un usuario NO puede tener más de una caja abierta al mismo tiempo
- El monto inicial debe ser mayor o igual a 0

---

### 2. Verificar Caja Abierta

**Endpoint:** `GET /api/v1/cajas/abierta/:usuarioId`

**Ejemplo:** `GET /api/v1/cajas/abierta/1`

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "usuarioId": 1,
    "montoInicial": 1000.00,
    "estado": "abierta",
    "fechaApertura": "2026-01-11T08:00:00.000Z"
  }
}
```

---

### 3. Realizar Ventas (Automático)

Cuando creas una venta con `POST /api/v1/ventas`:

```json
{
  "usuarioId": 1,
  "tipoVenta": "contado",  // o "transferencia"
  "detalles": [...]
}
```

**El sistema automáticamente:**
1. Crea la venta
2. Registra el pago
3. **Busca la caja abierta del usuario**
4. **Registra el movimiento en la caja**

**Tipos de registro según tipo de venta:**
- `"contado"` → Se registra en **medioPagoId: 1** (Efectivo)
- `"transferencia"` → Se registra en **medioPagoId: 2** (Transferencia)
- `"cuenta_corriente"` → NO se registra en caja (es a crédito)

---

### 4. Movimientos Manuales (Opcional)

Para ingresos o retiros adicionales de dinero:

**Endpoint:** `POST /api/v1/cajas/:id/movimiento`

**Ejemplo - Ingreso:**
```json
{
  "tipoMovimiento": "ingreso",
  "medioPagoId": 1,
  "monto": 500.00,
  "descripcion": "Ingreso de fondo de cambio adicional"
}
```

**Ejemplo - Retiro:**
```json
{
  "tipoMovimiento": "retiro",
  "medioPagoId": 1,
  "monto": 200.00,
  "descripcion": "Retiro para gastos menores"
}
```

---

### 5. Ver Resumen de Caja (Durante el día)

**Endpoint:** `GET /api/v1/cajas/:id/resumen`

**Ejemplo:** `GET /api/v1/cajas/1/resumen`

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "caja": {
      "id": 1,
      "usuarioId": 1,
      "montoInicial": 1000.00,
      "estado": "abierta",
      "fechaApertura": "2026-01-11T08:00:00.000Z"
    },
    "movimientos": [
      {
        "id": 1,
        "tipoMovimiento": "venta",
        "medioPagoId": 1,
        "monto": 250.00,
        "descripcion": "Venta V20260111001",
        "fechaMovimiento": "2026-01-11T10:30:00.000Z"
      },
      {
        "id": 2,
        "tipoMovimiento": "venta",
        "medioPagoId": 2,
        "monto": 180.00,
        "descripcion": "Venta V20260111002",
        "fechaMovimiento": "2026-01-11T11:00:00.000Z"
      }
    ],
    "resumen": {
      "montoInicial": 1000.00,
      "totalEfectivo": 250.00,
      "totalTransferencias": 180.00,
      "totalVentas": 430.00,
      "montoEsperadoEnCaja": 1250.00,
      "diferencia": 0
    }
  }
}
```

---

### 6. Cerrar Caja (Fin de Jornada)

**Endpoint:** `POST /api/v1/cajas/:id/cerrar`

**Body:**
```json
{
  "montoFinalContado": 1250.00,
  "observaciones": "Cierre de caja del día"
}
```

**Qué hace el sistema:**
1. Suma todos los movimientos de la caja
2. Calcula:
   - Total en efectivo
   - Total en transferencias
   - Total de ventas
3. Compara lo que **debería haber** vs lo que **realmente hay**
4. Calcula la diferencia (faltante o sobrante)

**Respuesta:**
```json
{
  "success": true,
  "message": "Caja cerrada exitosamente",
  "data": {
    "id": 1,
    "usuarioId": 1,
    "montoInicial": 1000.00,
    "montoFinal": 1250.00,
    "totalEfectivo": 250.00,
    "totalTransferencias": 180.00,
    "totalVentas": 430.00,
    "diferencia": 0.00,
    "estado": "cerrada",
    "fechaApertura": "2026-01-11T08:00:00.000Z",
    "fechaCierre": "2026-01-11T18:00:00.000Z"
  }
}
```

**Interpretación de la diferencia:**
- `diferencia: 0` → Cuadra perfectamente ✅
- `diferencia: -50` → Falta dinero 🔴 (esperado: 1300, real: 1250)
- `diferencia: 50` → Sobra dinero 🔴 (esperado: 1200, real: 1250)

---

### 7. Historial de Cajas

**Endpoint:** `GET /api/v1/cajas/usuario/:usuarioId`

**Ejemplo:** `GET /api/v1/cajas/usuario/1`

**Respuesta:** Lista de todas las cajas (abiertas y cerradas) del usuario, ordenadas por fecha.

---

## Reglas de Negocio

### ✅ Validaciones

1. **Un usuario solo puede tener UNA caja abierta a la vez**
2. **No se pueden registrar ventas si no hay caja abierta** (solo advertencia en consola, no bloquea)
3. **Solo se registran en caja las ventas de tipo "contado" y "transferencia"**
4. **Las ventas a cuenta corriente NO se registran en caja**
5. **Una caja cerrada no puede recibir más movimientos**

### 📊 Cálculos Automáticos

**Total Efectivo:**
```
montoInicial 
+ ventas en efectivo 
+ ingresos manuales 
- retiros manuales
```

**Total Transferencias:**
```
ventas en transferencia
```

**Monto Esperado en Caja:**
```
montoInicial + totalEfectivo
```

**Diferencia:**
```
montoEsperado - montoFinalContado
```

---

## Flujo Recomendado para el Frontend

```
1. Login → Verificar si tiene caja abierta
   ├─ SI → Mostrar dashboard con caja activa
   └─ NO → Solicitar abrir caja

2. Al abrir caja → Pedir monto inicial

3. Durante el día → 
   ├─ Crear ventas normalmente
   ├─ Ver resumen de caja en tiempo real
   └─ Registrar ingresos/retiros si es necesario

4. Al cerrar → 
   ├─ Mostrar resumen del día
   ├─ Pedir contar dinero físico
   ├─ Mostrar diferencia
   └─ Confirmar cierre
```

---

## Ejemplo de Uso Completo

```bash
# 1. Abrir caja (8:00 AM)
POST /api/v1/cajas/abrir
{ "usuarioId": 1, "montoInicial": 1000 }

# 2. Realizar ventas durante el día
POST /api/v1/ventas
{ "tipoVenta": "contado", "total": 250, ... }

POST /api/v1/ventas
{ "tipoVenta": "transferencia", "total": 180, ... }

# 3. Ver resumen en cualquier momento
GET /api/v1/cajas/1/resumen

# 4. Cerrar caja (6:00 PM)
POST /api/v1/cajas/1/cerrar
{ "montoFinalContado": 1250 }
```

---

## Base de Datos

### Tabla: cajas
- Registra apertura y cierre de cada caja
- Guarda totales calculados al cerrar

### Tabla: cajas_movimientos
- Registra CADA transacción individual
- Permite auditoría detallada
- Se usa para calcular totales al cerrar

### Relaciones
```
Caja → Usuario (quien abrió)
CajaMovimiento → Caja
CajaMovimiento → Pago (si es venta)
CajaMovimiento → MedioPago (efectivo/transferencia)
```
