# Uso: Creación y actualización de productos (ejemplos) ✅

Este documento muestra ejemplos de cómo crear y actualizar productos y su stock usando `cantidadInicial` y la nueva propiedad `cantidadInicialUnidadId`.

---

## IDs de unidades (ejemplo)
- 1 -> Unidad (`un`)
- 2 -> Kilogramo (`kg`)
- 3 -> Gramo (`g`)
- 4 -> Litro (`l`)
- 5 -> Mililitro (`ml`)

> Recomendación: tu frontend puede pedir la lista real con la ruta que expone las unidades (`/api/v1/unidades` o consultar la tabla `unidades_medida`).

---

## 1) Crear producto — cantidad inicial en la misma unidad del producto

POST /api/v1/productos/

Ejemplo (producto en kg, cantidad inicial expresada en kg):

curl -X POST http://localhost:3000/api/v1/productos/ \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "MORT001",
    "nombre": "Mortadela",
    "precioCosto": 100,
    "precioVenta": 150,
    "unidadMedidaId": 2,
    "cantidadInicial": 5.4995
  }'

Resultado esperado:
- El stock se guarda en la misma unidad del producto (kg) → `stock_actual.cantidad = 5.4995`.

---

## 2) Crear producto — cantidad inicial en otra unidad (ej.: envías gramos, producto en kg)

POST /api/v1/productos/

Ejemplo (producto en kg, cantidad inicial enviada en gramos):

curl -X POST http://localhost:3000/api/v1/productos/ \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "MORT002",
    "nombre": "Mortadela 2",
    "precioCosto": 100,
    "precioVenta": 150,
    "unidadMedidaId": 2,             // producto en kg
    "cantidadInicial": 1700,         // 1700 g
    "cantidadInicialUnidadId": 3     // 3 == 'g'
  }'

Qué hace el servidor:
- Busca las unidades por `id` y verifica compatibilidad.
- Convierte `1700 g` → `1.7 kg` con `unitConversionService`.
- Guarda `stock_actual.cantidad = 1.7` (unidad del producto: kg).

---

## 3) Actualizar producto con nueva cantidad inicial y unidad

PUT /api/v1/productos/:id

Ejemplo:

curl -X PUT http://localhost:3000/api/v1/productos/123 \
  -H "Content-Type: application/json" \
  -d '{
    "cantidadInicial": 5500,
    "cantidadInicialUnidadId": 3
  }'

- Si `cantidadInicialUnidadId` no coincide con la unidad del producto, se intentará convertir antes de actualizar el stock.

---

## 4) Actualizar stock directamente (usa la unidad del producto)

PATCH /api/v1/productos/:id/stock

Ejemplo (cantidad enviada debe estar en la misma unidad del producto):

curl -X PATCH http://localhost:3000/api/v1/productos/123/stock \
  -H "Content-Type: application/json" \
  -d '{ "cantidad": 10 }'

- Este endpoint acepta solo la cantidad en la unidad que el producto declara (no acepta `cantidadInicialUnidadId`).

---

## Errores comunes y cómo evitarlos
- "La unidad de la cantidad inicial (...) no es compatible..." → envía una unidad compatible (peso vs volumen no son compatibles).
- Formato decimal con coma ("1,7") puede no convertirse correctamente en algunos clientes: enviar con punto (`1.7`) o normalizar en frontend.
- Si no conoces el `id` de la unidad, pide al backend la lista de unidades o consulta la tabla `unidades_medida`.

---

## Notas técnicas
- La conversión se realiza con `unitConversionService.convertir(valor, unidadOrigen, unidadDestino)` y solo se permite entre unidades compatibles (peso-volumen-longitud-unidad).
- Si quieres, agrego ejemplos en `controllers/productos.controller.ts` como comentarios o creo tests unitarios para estos casos.

---

¿Quieres que agregue los snippets `curl` dentro del controlador como comentarios o prefieres que cree ejemplos en Postman collection? 😊