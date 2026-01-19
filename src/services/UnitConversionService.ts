import { Decimal } from "@prisma/client/runtime/library";

export class UnitConversionService {
  
  /**
   * Factores de conversión a la unidad base
   * Para convertir DE la unidad A la unidad base (multiplicar)
   */
  private readonly CONVERSION_FACTORS = {
    // PESO - Base: gramos (g)
    'g': 1,           
    'gr': 1,          // gramo (alternativa)
    'kg': 1000,       
    'kgs': 1000,      // kilogramos (plural)
    'lb': 453.592,    
    'lbs': 453.592,   // libras (plural)
    'oz': 28.3495,    
    
    // VOLUMEN - Base: mililitros (ml)
    'ml': 1,          
    'cc': 1,          // centímetro cúbico = mililitro
    'l': 1000,        
    'lt': 1000,       // ✅ AGREGAR: litro (abreviatura común)
    'lts': 1000,      // ✅ AGREGAR: litros (plural)
    'litro': 1000,    // ✅ AGREGAR: litro (completo)
    'litros': 1000,   // ✅ AGREGAR: litros (completo plural)
    'gal': 3785.41,   
    'galon': 3785.41, 
    
    // LONGITUD - Base: milímetros (mm)
    'mm': 1,          
    'cm': 10,         
    'm': 1000,        
    'mts': 1000,      // metros (plural)
    
    // UNIDADES
    'unidad': 1,      
    'un': 1,          // unidad (abreviada)
    'caja': 1,        
    'paquete': 1,     
    'paq': 1,         // paquete (abreviado)
  };

  /**
   * Normaliza la abreviatura de unidad a minúsculas y sin espacios
   */
  private normalizarUnidad(unidad: string): string {
    return unidad.toLowerCase().trim();
  }

  /**
   * Convierte una cantidad de una unidad a la unidad base
   */
  convertirAUnidadBase(cantidad: number, unidadAbreviatura: string): Decimal {
    const unidadNormalizada = this.normalizarUnidad(unidadAbreviatura);
    const factor = this.CONVERSION_FACTORS[unidadNormalizada];
    
    if (factor === undefined) {
      throw new Error(
        `Unidad de medida no soportada: "${unidadAbreviatura}" (normalizada: "${unidadNormalizada}"). ` +
        `Unidades válidas: ${Object.keys(this.CONVERSION_FACTORS).join(', ')}`
      );
    }

    const resultado = new Decimal(cantidad).times(factor);
    
    console.log(`🔄 Conversión a base:`, {
      cantidadOriginal: cantidad,
      unidadOriginal: unidadAbreviatura,
      unidadNormalizada,
      factor,
      resultado: resultado.toNumber()
    });

    return resultado;
  }

  /**
   * Convierte una cantidad de la unidad base a otra unidad
   */
  convertirDesdeUnidadBase(cantidadBase: number, unidadAbreviatura: string): Decimal {
    const unidadNormalizada = this.normalizarUnidad(unidadAbreviatura);
    const factor = this.CONVERSION_FACTORS[unidadNormalizada];
    
    if (factor === undefined) {
      throw new Error(
        `Unidad de medida no soportada: "${unidadAbreviatura}" (normalizada: "${unidadNormalizada}"). ` +
        `Unidades válidas: ${Object.keys(this.CONVERSION_FACTORS).join(', ')}`
      );
    }

    const resultado = new Decimal(cantidadBase).dividedBy(factor);
    
    console.log(`🔄 Conversión desde base:`, {
      cantidadBase,
      unidadDestino: unidadAbreviatura,
      unidadNormalizada,
      factor,
      resultado: resultado.toNumber()
    });

    return resultado;
  }

  /**
   * Convierte de una unidad a otra
   */
  convertir(cantidad: number, unidadOrigen: string, unidadDestino: string): Decimal {
    const cantidadBase = this.convertirAUnidadBase(cantidad, unidadOrigen);
    return this.convertirDesdeUnidadBase(cantidadBase.toNumber(), unidadDestino);
  }

  /**
   * Valida si dos unidades son del mismo tipo
   */
  sonUnidadesCompatibles(unidad1: string, unidad2: string): boolean {
    const tiposPeso = ['g', 'gr', 'kg', 'kgs', 'lb', 'lbs', 'oz'];
    const tiposVolumen = ['ml', 'cc', 'l', 'lt', 'lts', 'litro', 'litros', 'gal', 'galon'];
    const tiposLongitud = ['mm', 'cm', 'm', 'mts'];
    const tiposUnidad = ['unidad', 'un', 'caja', 'paquete', 'paq'];

    const u1 = this.normalizarUnidad(unidad1);
    const u2 = this.normalizarUnidad(unidad2);

    const compatible = (
      (tiposPeso.includes(u1) && tiposPeso.includes(u2)) ||
      (tiposVolumen.includes(u1) && tiposVolumen.includes(u2)) ||
      (tiposLongitud.includes(u1) && tiposLongitud.includes(u2)) ||
      (tiposUnidad.includes(u1) && tiposUnidad.includes(u2))
    );

    console.log(`🔍 Validación compatibilidad:`, {
      unidad1,
      unidad2,
      u1Normalizada: u1,
      u2Normalizada: u2,
      compatible
    });

    return compatible;
  }

  /**
   * Obtiene el tipo de una unidad (peso, volumen, longitud, unidad)
   */
  obtenerTipoUnidad(unidad: string): string {
    const u = this.normalizarUnidad(unidad);
    
    if (['g', 'gr', 'kg', 'kgs', 'lb', 'lbs', 'oz'].includes(u)) return 'peso';
    if (['ml', 'cc', 'l', 'lt', 'lts', 'litro', 'litros', 'gal', 'galon'].includes(u)) return 'volumen';
    if (['mm', 'cm', 'm', 'mts'].includes(u)) return 'longitud';
    if (['unidad', 'un', 'caja', 'paquete', 'paq'].includes(u)) return 'unidad';
    
    return 'desconocido';
  }
}

export const unitConversionService = new UnitConversionService();

