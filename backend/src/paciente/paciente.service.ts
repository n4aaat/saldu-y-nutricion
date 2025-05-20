import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { HistorialCrecimiento } from './entities/historialCrecimiento.entity';
import { percentiles } from './constants/data';
import { UpdateHistorialDto } from './dto/update-historial.dto';

@Injectable()
export class PacienteService {

  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(HistorialCrecimiento)
    private readonly historialRepository: Repository<HistorialCrecimiento>
  ) { }

  async create(createpacienteDto: CreatePacienteDto) {
    const paciente = this.pacienteRepository.create(createpacienteDto)
    await this.pacienteRepository.save(paciente)
    return paciente;
  }

  findAll() {
    return this.pacienteRepository.find({
      relations: ['crecimiento'],
      select: ['id', 'nombre', 'genero', 'fecha_nacimiento'],
      order: { nombre: 'ASC' },
    }).then((pacientes) => {
      return pacientes.map((paciente) => {

        const historialOrdenado = paciente.crecimiento.sort((a, b) => {
          return new Date(b.fecha_medicion).getTime() - new Date(a.fecha_medicion).getTime();
        });
        const historialActual = historialOrdenado.length > 0 ? historialOrdenado[0] : null;

        const pesoActual = historialActual ? historialActual.peso : 0;
        const alturaActual = historialActual ? historialActual.altura : 0;

        const edadActual = this.calcularEdad(new Date(paciente.fecha_nacimiento));

        return {
          id: paciente.id,
          nombre: paciente.nombre,
          genero: paciente.genero,
          fecha_nacimiento: paciente.fecha_nacimiento,
          peso_actual: pesoActual,
          altura_actual: alturaActual,
          edad_actual: edadActual // Agregar la edad actual al objeto de retorno
        };
      });
    });
  }

  async findOne(id: string) {
    const paciente = await this.pacienteRepository.findOneBy({ id })
    if (!paciente)
      throw new NotFoundException(`DDDEl paciente con el id ${id} no se encuentra.`)
    let result = this.calcularEdad(new Date(paciente.fecha_nacimiento))
    let percentil = {
      peso: (paciente.genero === "hombre") ? percentiles.peso.boy : percentiles.peso.girl,
      estatura: (paciente.genero === "hombre") ? percentiles.estatura.boy : percentiles.estatura.girl,
      imc: (paciente.genero === "hombre") ? percentiles.imc.boy : percentiles.imc.girl
    }
    return ({ ...paciente, ...result, percentil: { ...percentil } })
  }

  private calcularEdad(fechaNacimiento: Date, fechaActual: Date = new Date()) {
    const diaActual = fechaActual.getDate();
    const mesActual = fechaActual.getMonth() + 1; // Los meses se indexan desde 0

    const diaNacimiento = fechaNacimiento.getDate();
    const mesNacimiento = fechaNacimiento.getMonth() + 1;
    const anioNacimiento = fechaNacimiento.getFullYear();

    let edadAnios = fechaActual.getFullYear() - anioNacimiento;
    let edadMeses = mesActual - mesNacimiento;
    let edadDias = diaActual - diaNacimiento;

    // Ajustar la edad si los meses o los días aún no se han alcanzado en el año actual
    if (edadMeses < 0 || (edadMeses === 0 && edadDias < 0)) {
      edadAnios--;
      edadMeses += 12;
    }

    if (edadDias < 0) {
      const ultimoDiaMesAnterior = new Date(anioNacimiento, mesNacimiento - 1, 0).getDate();
      edadDias += ultimoDiaMesAnterior;
      edadMeses--;
    }

    // Calcular la edad en decimales
    const diasEnAnioActual = (new Date(anioNacimiento, 11, 31).getTime() - new Date(anioNacimiento, 0, 1).getTime()) / (1000 * 60 * 60 * 24);
    let edadDecimal = (edadDias + (edadMeses * 30) + (edadAnios * diasEnAnioActual)) / diasEnAnioActual;

    return {
      anios: edadAnios,
      meses: edadMeses,
      dias: edadDias,
      decimal: edadDecimal.toFixed(2)
    };
  }

  async update(id: string, updatePacienteDto: UpdatePacienteDto) {
    const paciente = await this.pacienteRepository.findOne({ where: { id } });
    if (!paciente) {
      throw new NotFoundException(`El paciente con el id ${id} no se encuentra.`);
    }
    Object.assign(paciente, updatePacienteDto);
    await this.pacienteRepository.save(paciente);
    return paciente;
  }

  async remove(id: string) {
    const paciente = await this.pacienteRepository.findOne({ where: { id } });
    if (!paciente) {
      throw new NotFoundException(`El paciente con el id ${id} no se encuentra.`);
    }
    await this.pacienteRepository.remove(paciente);
    return { message: `Paciente con id ${id} eliminado exitosamente.` };
  }

  async createHistorial(createHistoriaDto: CreateHistorialDto) {
    const { paciente, ...historialDto } = createHistoriaDto
    const pacienteobj = await this.pacienteRepository.findOneBy({ id: paciente })
    if (!pacienteobj)
      throw new NotFoundException(`El paciente aaa ${pacienteobj} no se encuentra.`);
    const historial = this.historialRepository.create({
      paciente: pacienteobj,
      ...historialDto,
    });
    await this.historialRepository.save(historial);
    return historial
  }

  async getHistorialCrecimiento(id: string) {
    const paciente = await this.pacienteRepository.findOne({ where: { id }, relations: ['crecimiento'] });
    if (!paciente) {
      throw new NotFoundException(`bbbEl paciente con el id ${id} no se encuentra.`);
    }
    const historialConEdad = paciente.crecimiento.map((h) => ({
      id: h.id,
      fecha_medicion: h.fecha_medicion,
      altura: h.altura,
      peso: h.peso,
      imc: h.imc,
      edad_decimal: this.calcularEdad(new Date(paciente.fecha_nacimiento), new Date(h.fecha_medicion)).decimal // Calcula la edad decimal
    }));
    return historialConEdad;
  }

  async updateHistorial(id: number, updateHistorialDto: UpdateHistorialDto) {
    const historial = await this.historialRepository.findOne({ where: { id } });
    if (!historial) {
      throw new NotFoundException(`CCCEl historial con el id ${id} no se encuentra.`);
    }
    Object.assign(historial, updateHistorialDto);
    await this.historialRepository.save(historial);
    return historial;
  }

  async removeHistorial(id: number) {
    const historial = await this.historialRepository.findOne({ where: { id } });
    if (!historial) {
      throw new NotFoundException(`El historial con el id ${id} no se encuentra.`);
    }
    await this.historialRepository.remove(historial);
    return { message: `Historial con id ${id} eliminado exitosamente.` };
  }

  percentil(id: string) {
    if (id === "imc") {
      return percentiles.imc;
    } else if (id === "peso") {
      return percentiles.peso;
    } else if (id === "altura") {
      return percentiles.estatura;
    } else {
      throw new Error("Parámetro inválido");
    }
  }

  async exportToExcel() {
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Pacientes');
  
  // Obtener todos los pacientes con su historial
  const pacientes = await this.pacienteRepository.find({
    relations: ['crecimiento'],
  });
  
  // Definir encabezados
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 36 },
    { header: 'Nombre', key: 'nombre', width: 30 },
    { header: 'Género', key: 'genero', width: 10 },
    { header: 'Fecha Nacimiento', key: 'fecha_nacimiento', width: 15 },
    { header: 'Edad (años)', key: 'edad_anios', width: 10 },
    { header: 'Peso Actual (kg)', key: 'peso_actual', width: 15 },
    { header: 'Altura Actual (cm)', key: 'altura_actual', width: 15 },
    { header: 'IMC Actual', key: 'imc_actual', width: 10 },
    { header: 'Estado Nutricional', key: 'estado', width: 20 },
  ];
  
  // Agregar estilos a los encabezados
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' }
  };
  
  // Llenar datos
  for (const paciente of pacientes) {
    // Ordenar historial por fecha más reciente
    const historialOrdenado = paciente.crecimiento.sort((a, b) => {
      return new Date(b.fecha_medicion).getTime() - new Date(a.fecha_medicion).getTime();
    });
    
    const historialActual = historialOrdenado.length > 0 ? historialOrdenado[0] : null;
    const pesoActual = historialActual ? historialActual.peso : 0;
    const alturaActual = historialActual ? historialActual.altura : 0;
    const imcActual = historialActual ? historialActual.imc : 0;
    
    const edadActual = this.calcularEdad(new Date(paciente.fecha_nacimiento));
    
    // Determinar estado nutricional
    let estado = 'No disponible';
    if (historialActual) {
      const genero = paciente.genero.toLowerCase();
      const percentilData = genero === 'hombre' ? 
        require('./constants/data').percentiles.imc.boy : 
        require('./constants/data').percentiles.imc.girl;
      
      const percentilInfo = this.calcularEstadoNutricional(edadActual.decimal, imcActual, percentilData);
      estado = percentilInfo.categoria;
    }
    
    // Agregar fila
    worksheet.addRow({
      id: paciente.id,
      nombre: paciente.nombre,
      genero: paciente.genero,
      fecha_nacimiento: new Date(paciente.fecha_nacimiento).toLocaleDateString(),
      edad_anios: edadActual.anios,
      peso_actual: pesoActual,
      altura_actual: alturaActual,
      imc_actual: imcActual,
      estado: estado
    });
  }
  
  // Crear una hoja para el historial completo
  const historialSheet = workbook.addWorksheet('Historial Completo');
  
  historialSheet.columns = [
    { header: 'ID Paciente', key: 'paciente_id', width: 36 },
    { header: 'Nombre', key: 'nombre', width: 30 },
    { header: 'Fecha Medición', key: 'fecha_medicion', width: 15 },
    { header: 'Edad (años)', key: 'edad', width: 10 },
    { header: 'Peso (kg)', key: 'peso', width: 10 },
    { header: 'Altura (cm)', key: 'altura', width: 10 },
    { header: 'IMC', key: 'imc', width: 10 },
    { header: 'Estado', key: 'estado', width: 20 },
  ];
  
  historialSheet.getRow(1).font = { bold: true };
  historialSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' }
  };
  
  // Llenar historial completo
  for (const paciente of pacientes) {
    for (const historial of paciente.crecimiento) {
      const edadEnMedicion = this.calcularEdad(
        new Date(paciente.fecha_nacimiento),
        new Date(historial.fecha_medicion)
      );
      
      const genero = paciente.genero.toLowerCase();
      const percentilData = genero === 'hombre' ? 
        require('./constants/data').percentiles.imc.boy : 
        require('./constants/data').percentiles.imc.girl;
      
      const percentilInfo = this.calcularEstadoNutricional(
        edadEnMedicion.decimal, 
        historial.imc, 
        percentilData
      );
      
      historialSheet.addRow({
        paciente_id: paciente.id,
        nombre: paciente.nombre,
        fecha_medicion: new Date(historial.fecha_medicion).toLocaleDateString(),
        edad: edadEnMedicion.decimal,
        peso: historial.peso,
        altura: historial.altura,
        imc: historial.imc,
        estado: percentilInfo.categoria
      });
    }
  }
  
  // Generar buffer para devolver
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

// Método auxiliar para calcular el estado nutricional
private calcularEstadoNutricional(edad, imc, percentilData) {
  let percentilCercano = null;
  let distanciaMinima = Infinity;

  for (let percentil in percentilData) {
    let datosPercentil = percentilData[percentil];
    
    let percentilEncontrado = datosPercentil.reduce((prev, curr) => {
      if (Math.abs(curr.x - edad) < Math.abs(prev.x - edad)) {
        return curr;
      } else {
        return prev;
      }
    });
    
    let distancia = Math.abs(imc - percentilEncontrado.y);
    
    if (distancia < distanciaMinima) {
      distanciaMinima = distancia;
      percentilCercano = percentil;
    }
  }
  
  let categoria = '';
  let color = '';
  
  if (percentilCercano === 'p5') {
    if (imc < percentilData[percentilCercano][0].y) {
      categoria = 'Bajo Peso';
      color = 'warning';
    } else {
      categoria = 'Peso Saludable';
      color = 'success';
    }
  } else if (percentilCercano === 'p85') {
    categoria = 'Sobrepeso';
    color = 'warning';
  } else if (percentilCercano === 'p95') {
    categoria = 'Obesidad';
    color = 'danger';
  } else {
    categoria = 'Peso Saludable';
    color = 'success';
  }
  
  return {
    percentil: percentilCercano,
    categoria: categoria,
    color: color
  };
}
}
