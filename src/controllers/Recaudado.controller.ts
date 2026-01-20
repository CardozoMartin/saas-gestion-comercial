import { prisma } from "../config/database";
import { Request, Response } from "express";

export class RecaudadoController {
  // Controlador para obtener lo recaudado por mes
  async getRecaudadoPorMes(req: Request, res: Response): Promise<Response> {
    try {
      const year = req.query.year 
        ? parseInt(req.query.year as string) 
        : new Date().getFullYear();

      const recaudadoPorMes = await prisma.$queryRaw<any[]>`
        SELECT 
          MONTH(v.fecha_venta) as mes,
          MONTHNAME(v.fecha_venta) as nombre_mes,
          COUNT(DISTINCT v.id) as total_ventas,
          SUM(v.total) as total_recaudado,
          AVG(v.total) as promedio_venta,
          SUM(CASE WHEN v.tipo_venta = 'contado' THEN v.total ELSE 0 END) as total_contado,
          SUM(CASE WHEN v.tipo_venta = 'cuenta_corriente' THEN v.total ELSE 0 END) as total_cuenta_corriente,
          SUM(CASE WHEN v.tipo_venta = 'transferencia' THEN v.total ELSE 0 END) as total_transferencia,
          COUNT(CASE WHEN v.estado = 'pagada' THEN 1 END) as ventas_pagadas,
          COUNT(CASE WHEN v.estado = 'pendiente' THEN 1 END) as ventas_pendientes
        FROM ventas v
        WHERE YEAR(v.fecha_venta) = ${year}
          AND v.estado != 'cancelada'
        GROUP BY MONTH(v.fecha_venta), MONTHNAME(v.fecha_venta)
        ORDER BY mes ASC
      `;

      // Transformar Decimals a números
      const data = recaudadoPorMes.map(row => ({
        mes: Number(row.mes),
        nombre_mes: row.nombre_mes,
        total_ventas: Number(row.total_ventas),
        total_recaudado: Number(row.total_recaudado),
        promedio_venta: Number(row.promedio_venta),
        total_contado: Number(row.total_contado),
        total_cuenta_corriente: Number(row.total_cuenta_corriente),
        total_transferencia: Number(row.total_transferencia),
        ventas_pagadas: Number(row.ventas_pagadas),
        ventas_pendientes: Number(row.ventas_pendientes)
      }));

      return res.status(200).json({
        success: true,
        year,
        count: data.length,
        data
      });
    } catch (error) {
      console.error('Error al obtener recaudación por mes:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los datos de recaudación por mes",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Controlador para obtener lo recaudado por semana
  async getRecaudadoPorSemana(req: Request, res: Response): Promise<Response> {
    try {
      const weeksBack = req.query.weeks 
        ? parseInt(req.query.weeks as string) 
        : 12;

      const recaudadoPorSemana = await prisma.$queryRaw<any[]>`
        SELECT 
          YEAR(v.fecha_venta) as año,
          WEEK(v.fecha_venta, 1) as numero_semana,
          DATE(DATE_SUB(v.fecha_venta, INTERVAL WEEKDAY(v.fecha_venta) DAY)) as inicio_semana,
          DATE(DATE_ADD(DATE_SUB(v.fecha_venta, INTERVAL WEEKDAY(v.fecha_venta) DAY), INTERVAL 6 DAY)) as fin_semana,
          COUNT(v.id) as total_ventas,
          SUM(v.total) as total_recaudado,
          AVG(v.total) as promedio_venta
        FROM ventas v
        WHERE v.fecha_venta >= DATE_SUB(CURDATE(), INTERVAL ${weeksBack} WEEK)
          AND v.estado != 'cancelada'
        GROUP BY 
          YEAR(v.fecha_venta),
          WEEK(v.fecha_venta, 1),
          inicio_semana,
          fin_semana
        ORDER BY año DESC, numero_semana DESC
      `;

      // Transformar datos
      const data = recaudadoPorSemana.map(row => ({
        año: Number(row.año),
        numero_semana: Number(row.numero_semana),
        inicio_semana: row.inicio_semana,
        fin_semana: row.fin_semana,
        total_ventas: Number(row.total_ventas),
        total_recaudado: Number(row.total_recaudado),
        promedio_venta: Number(row.promedio_venta)
      }));

      return res.status(200).json({
        success: true,
        weeksBack,
        count: data.length,
        data
      });
    } catch (error) {
      console.error('Error al obtener recaudación por semana:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los datos de recaudación por semana",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

export const recaudadoController = new RecaudadoController();